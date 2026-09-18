#!/usr/bin/env python3
"""
LinkGuard - Complete Supply Chain Risk Management System
Single unified application with login portal and enhanced features
"""

import dash
from dash import dcc, html, Input, Output, State, callback_context, dash_table
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import sqlite3
import json
from datetime import datetime
import os
import sys
import hashlib

# Add backend modules to path
sys.path.append('backend')
from models import SupplyChainDB, RiskPredictor, GraphBuilder

# Initialize components
db = SupplyChainDB("data/supply_chain.db")
risk_predictor = RiskPredictor("models/risk_model.pkl")
graph_builder = GraphBuilder()

# Initialize Dash app
app = dash.Dash(__name__)
app.title = "LinkGuard Supply Chain Management"
app.config.suppress_callback_exceptions = True

# Sample data for demonstration
SAMPLE_EQUIPMENT = [
    {"name": "Advanced Radar System", "type": "electronics", "criticality": "high"},
    {"name": "Armored Vehicle Engine", "type": "vehicle", "criticality": "high"},
    {"name": "Communication Radio", "type": "communication", "criticality": "medium"},
    {"name": "Night Vision Scope", "type": "electronics", "criticality": "high"},
    {"name": "Bulletproof Vest", "type": "armor", "criticality": "medium"}
]

SAMPLE_SUPPLIERS = [
    {"name": "Primary Defense Corp", "country": "India", "tier": 1, "risk": "low"},
    {"name": "Electronics Ltd", "country": "Germany", "tier": 2, "risk": "medium"},
    {"name": "Steel Industries", "country": "India", "tier": 2, "risk": "low"},
    {"name": "Rare Metals Co", "country": "China", "tier": 3, "risk": "high"},
    {"name": "Precision Parts", "country": "Japan", "tier": 3, "risk": "low"},
    {"name": "Composite Materials", "country": "USA", "tier": 3, "risk": "medium"},
    {"name": "Mining Corp", "country": "Congo", "tier": 4, "risk": "high"},
    {"name": "Raw Materials", "country": "Australia", "tier": 4, "risk": "low"}
]

# Login page layout
def login_layout():
    return html.Div([
        html.Div([
            html.Div([
                html.H1("LinkGuard", style={
                    'fontSize': '4em', 
                    'fontWeight': 'bold',
                    'background': 'linear-gradient(45deg, #ffd700, #ffed4e)',
                    'webkitBackgroundClip': 'text',
                    'webkitTextFillColor': 'transparent',
                    'textAlign': 'center',
                    'marginBottom': '10px',
                    'fontFamily': 'Arial Black, sans-serif'
                }),
                html.P("AI-Powered Supply Chain Risk Management", style={
                    'textAlign': 'center',
                    'fontSize': '1.2em',
                    'color': '#e0e0e0',
                    'marginBottom': '40px'
                }),
                
                html.Div([
                    html.H3("Login Portal", style={'color': '#ffd700', 'marginBottom': '30px'}),
                    
                    html.Div([
                        html.Label("User Type", style={'color': '#e0e0e0', 'marginBottom': '10px', 'display': 'block'}),
                        dcc.Dropdown(
                            id='user-type',
                            options=[
                                {'label': 'Administrator', 'value': 'admin'},
                                {'label': 'Analyst', 'value': 'analyst'},
                                {'label': 'Viewer', 'value': 'viewer'}
                            ],
                            value='admin',
                            style={'marginBottom': '20px'}
                        )
                    ]),
                    
                    html.Div([
                        html.Label("Username", style={'color': '#e0e0e0', 'marginBottom': '10px', 'display': 'block'}),
                        dcc.Input(
                            id='username',
                            type='text',
                            placeholder='Enter username',
                            value='admin',
                            style={
                                'width': '100%',
                                'padding': '12px',
                                'borderRadius': '8px',
                                'border': 'none',
                                'marginBottom': '20px'
                            }
                        )
                    ]),
                    
                    html.Div([
                        html.Label("Email", style={'color': '#e0e0e0', 'marginBottom': '10px', 'display': 'block'}),
                        dcc.Input(
                            id='email',
                            type='email',
                            placeholder='Enter email',
                            value='admin@admin.com',
                            style={
                                'width': '100%',
                                'padding': '12px',
                                'borderRadius': '8px',
                                'border': 'none',
                                'marginBottom': '20px'
                            }
                        )
                    ]),
                    
                    html.Button(
                        'Login',
                        id='login-btn',
                        n_clicks=0,
                        style={
                            'width': '100%',
                            'padding': '15px',
                            'background': 'linear-gradient(45deg, #ffd700, #ffed4e)',
                            'color': '#333',
                            'border': 'none',
                            'borderRadius': '8px',
                            'fontSize': '16px',
                            'fontWeight': 'bold',
                            'cursor': 'pointer'
                        }
                    ),
                    
                    html.Div(id='login-message', style={'marginTop': '20px', 'textAlign': 'center'})
                    
                ], style={
                    'background': 'rgba(255, 255, 255, 0.1)',
                    'padding': '40px',
                    'borderRadius': '15px',
                    'backdropFilter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.2)'
                })
                
            ], style={
                'maxWidth': '400px',
                'margin': '0 auto',
                'marginTop': '10vh'
            }),
            
            # Footer
            html.Div([
                html.P("Developed by GaneshPrabu", style={'margin': '5px 0'}),
                html.P("+91-7338703622", style={'margin': '5px 0'}),
                html.P("ganeshprabu.bo2024@sece.ac.in", style={'margin': '5px 0'})
            ], style={
                'position': 'fixed',
                'bottom': '20px',
                'right': '20px',
                'color': '#ccc',
                'fontSize': '12px',
                'textAlign': 'right'
            })
            
        ], style={
            'minHeight': '100vh',
            'background': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            'color': '#fff',
            'fontFamily': 'Arial, sans-serif'
        })
    ])

# Main dashboard layout
def dashboard_layout():
    return html.Div([
        # Header
        html.Div([
            html.H1("🛡️ LinkGuard Supply Chain Management", style={
                'textAlign': 'center',
                'color': '#ffd700',
                'fontSize': '2.5em',
                'marginBottom': '10px',
                'textShadow': '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }),
            html.P("Indian Army - Advanced Multi-Tier Supply Chain Analysis & Risk Assessment", style={
                'textAlign': 'center',
                'fontSize': '1.1em',
                'opacity': '0.9'
            }),
            html.Button('Logout', id='logout-btn', n_clicks=0, style={
                'position': 'absolute',
                'top': '20px',
                'right': '20px',
                'padding': '10px 20px',
                'background': '#f44336',
                'color': 'white',
                'border': 'none',
                'borderRadius': '5px',
                'cursor': 'pointer'
            })
        ], style={
            'padding': '30px',
            'background': 'rgba(0, 0, 0, 0.3)',
            'borderRadius': '15px',
            'marginBottom': '30px',
            'backdropFilter': 'blur(10px)',
            'position': 'relative'
        }),
        
        # Input Cards
        html.Div([
            # Equipment Registration Card
            html.Div([
                html.H2("📊 Equipment Registration"),
                html.Div([
                    html.Label("Equipment/Component Name"),
                    dcc.Input(id='equipment-name', type='text', placeholder='e.g., Advanced Radar System', style={'width': '100%', 'padding': '12px', 'marginBottom': '15px', 'borderRadius': '8px', 'border': 'none'})
                ]),
                html.Div([
                    html.Label("Equipment Type"),
                    dcc.Dropdown(
                        id='equipment-type',
                        options=[
                            {'label': 'Weapon System', 'value': 'weapon'},
                            {'label': 'Electronics', 'value': 'electronics'},
                            {'label': 'Vehicle Component', 'value': 'vehicle'},
                            {'label': 'Communication Equipment', 'value': 'communication'},
                            {'label': 'Armor & Protection', 'value': 'armor'}
                        ],
                        style={'marginBottom': '15px'}
                    )
                ]),
                html.Div([
                    html.Label("Criticality Level"),
                    dcc.Dropdown(
                        id='criticality-level',
                        options=[
                            {'label': 'High', 'value': 'high'},
                            {'label': 'Medium', 'value': 'medium'},
                            {'label': 'Low', 'value': 'low'}
                        ],
                        value='high',
                        style={'marginBottom': '15px'}
                    )
                ]),
                html.Button('🔍 Map Supply Chain', id='map-chain-btn', n_clicks=0, className='btn')
            ], className='card', style={'width': '48%', 'display': 'inline-block', 'marginRight': '2%'}),
            
            # Supplier Data Input Card
            html.Div([
                html.H2("🌐 Supplier Data Input"),
                html.Div([
                    html.Label("Supplier Name"),
                    dcc.Input(id='supplier-name', type='text', placeholder='Primary Supplier', style={'width': '100%', 'padding': '12px', 'marginBottom': '15px', 'borderRadius': '8px', 'border': 'none'})
                ]),
                html.Div([
                    html.Label("Country of Origin"),
                    dcc.Input(id='supplier-country', type='text', placeholder='e.g., India, USA, Germany', style={'width': '100%', 'padding': '12px', 'marginBottom': '15px', 'borderRadius': '8px', 'border': 'none'})
                ]),
                html.Div([
                    html.Label("Supplier Tier"),
                    dcc.Dropdown(
                        id='tier-level',
                        options=[
                            {'label': 'Tier 1 (Direct)', 'value': '1'},
                            {'label': 'Tier 2', 'value': '2'},
                            {'label': 'Tier 3', 'value': '3'},
                            {'label': 'Tier 4', 'value': '4'}
                        ],
                        value='1',
                        style={'marginBottom': '15px'}
                    )
                ]),
                html.Button('➕ Add Supplier', id='add-supplier-btn', n_clicks=0, className='btn')
            ], className='card', style={'width': '48%', 'display': 'inline-block'})
        ], style={'marginBottom': '30px'}),
        
        # Main Content with Tabs
        html.Div([
            html.Div([
                html.Button('🗺️ Supply Chain Mapping', id='tab-mapping', n_clicks=1, className='tab active'),
                html.Button('📈 Risk Analysis', id='tab-analysis', n_clicks=0, className='tab'),
                html.Button('💡 Recommendations', id='tab-recommendations', n_clicks=0, className='tab'),
                html.Button('📋 Reports', id='tab-reports', n_clicks=0, className='tab')
            ], className='tabs'),
            
            # Tab Contents
            html.Div(id='tab-content')
        ], className='card full-width'),
        
        # Footer
        html.Div([
            html.P("Developed by GaneshPrabu | +91-7338703622 | ganeshprabu.bo2024@sece.ac.in", style={
                'textAlign': 'center',
                'color': '#ccc',
                'fontSize': '12px',
                'marginTop': '30px'
            })
        ])
        
    ], style={
        'maxWidth': '1400px',
        'margin': '0 auto',
        'padding': '20px',
        'minHeight': '100vh',
        'background': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        'color': '#fff',
        'fontFamily': 'Arial, sans-serif'
    })

# App layout with session state
app.layout = html.Div([
    dcc.Store(id='session-store', data={'logged_in': False}),
    html.Div(id='page-content')
])

# CSS styles
app.index_string = '''
<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>{%title%}</title>
        {%favicon%}
        {%css%}
        <style>
            .card {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                margin-bottom: 20px;
            }
            .card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .card h2 {
                color: #ffd700;
                margin-bottom: 20px;
                font-size: 1.5em;
                border-bottom: 2px solid #ffd700;
                padding-bottom: 10px;
            }
            .btn {
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                color: #333;
                border: none;
                padding: 12px 25px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                transition: all 0.3s ease;
                width: 100%;
                margin-top: 10px;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
            }
            .tabs {
                display: flex;
                margin-bottom: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                overflow: hidden;
            }
            .tab {
                flex: 1;
                padding: 15px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                background: transparent;
                color: #fff;
            }
            .tab.active {
                background: #ffd700;
                color: #333;
            }
            .full-width {
                width: 100%;
            }
            .supplier {
                background: linear-gradient(45deg, #4CAF50, #45a049);
                color: white;
                padding: 15px;
                border-radius: 10px;
                text-align: center;
                min-width: 120px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 10px;
                display: inline-block;
            }
            .supplier:hover {
                transform: scale(1.1);
                box-shadow: 0 10px 20px rgba(76, 175, 80, 0.4);
            }
            .supplier.vulnerable {
                background: linear-gradient(45deg, #f44336, #d32f2f);
                animation: pulse 2s infinite;
            }
            .supplier.medium-risk {
                background: linear-gradient(45deg, #ff9800, #f57c00);
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
                100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
            }
        </style>
    </head>
    <body>
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>
'''

# Callbacks
@app.callback(
    Output('page-content', 'children'),
    [Input('session-store', 'data')]
)
def display_page(session_data):
    if session_data.get('logged_in', False):
        return dashboard_layout()
    else:
        return login_layout()

@app.callback(
    [Output('session-store', 'data'),
     Output('login-message', 'children')],
    [Input('login-btn', 'n_clicks')],
    [State('user-type', 'value'),
     State('username', 'value'),
     State('email', 'value')]
)
def handle_login(n_clicks, user_type, username, email):
    if n_clicks > 0:
        # Simple authentication logic
        if (user_type == 'admin' and username == 'admin' and email == 'admin@admin.com') or \
           (user_type in ['analyst', 'viewer'] and username and email):
            return {'logged_in': True, 'user_type': user_type, 'username': username}, ""
        else:
            return {'logged_in': False}, html.Div("Invalid credentials", style={'color': 'red'})
    return {'logged_in': False}, ""

@app.callback(
    Output('session-store', 'data', allow_duplicate=True),
    [Input('logout-btn', 'n_clicks')],
    prevent_initial_call=True
)
def handle_logout(n_clicks):
    if n_clicks > 0:
        return {'logged_in': False}
    return {'logged_in': True}

@app.callback(
    Output('tab-content', 'children'),
    [Input('tab-mapping', 'n_clicks'),
     Input('tab-analysis', 'n_clicks'),
     Input('tab-recommendations', 'n_clicks'),
     Input('tab-reports', 'n_clicks')]
)
def update_tab_content(mapping_clicks, analysis_clicks, rec_clicks, reports_clicks):
    ctx = callback_context
    if not ctx.triggered:
        tab_id = 'tab-mapping'
    else:
        tab_id = ctx.triggered[0]['prop_id'].split('.')[0]
    
    if tab_id == 'tab-mapping':
        return mapping_tab_content()
    elif tab_id == 'tab-analysis':
        return analysis_tab_content()
    elif tab_id == 'tab-recommendations':
        return recommendations_tab_content()
    elif tab_id == 'tab-reports':
        return reports_tab_content()

def mapping_tab_content():
    return html.Div([
        html.H2("Multi-Tier Supply Chain Visualization"),
        html.Div([
            html.Div([
                html.H4("Tier 1", style={'color': '#ffd700', 'marginBottom': '15px'}),
                html.Div([
                    html.Div("Primary Defense Corp", className="supplier", style={'background': 'linear-gradient(45deg, #4CAF50, #45a049)'}),
                ], style={'textAlign': 'center'})
            ], style={'marginBottom': '30px'}),
            
            html.Div([
                html.H4("Tier 2", style={'color': '#ffd700', 'marginBottom': '15px'}),
                html.Div([
                    html.Div("Electronics Ltd", className="supplier medium-risk"),
                    html.Div("Steel Industries", className="supplier", style={'background': 'linear-gradient(45deg, #4CAF50, #45a049)'}),
                ], style={'textAlign': 'center'})
            ], style={'marginBottom': '30px'}),
            
            html.Div([
                html.H4("Tier 3", style={'color': '#ffd700', 'marginBottom': '15px'}),
                html.Div([
                    html.Div("Rare Metals Co", className="supplier vulnerable"),
                    html.Div("Precision Parts", className="supplier", style={'background': 'linear-gradient(45deg, #4CAF50, #45a049)'}),
                    html.Div("Composite Materials", className="supplier medium-risk"),
                ], style={'textAlign': 'center'})
            ], style={'marginBottom': '30px'}),
            
            html.Div([
                html.H4("Tier 4", style={'color': '#ffd700', 'marginBottom': '15px'}),
                html.Div([
                    html.Div("Mining Corp", className="supplier vulnerable"),
                    html.Div("Raw Materials", className="supplier", style={'background': 'linear-gradient(45deg, #4CAF50, #45a049)'}),
                ], style={'textAlign': 'center'})
            ])
        ], style={
            'background': 'rgba(0, 0, 0, 0.2)',
            'borderRadius': '10px',
            'padding': '20px',
            'minHeight': '400px'
        })
    ])

def analysis_tab_content():
    return html.Div([
        html.H2("Risk Assessment Dashboard"),
        html.Div([
            html.Div([
                html.Div("12", style={'fontSize': '2em', 'fontWeight': 'bold', 'color': '#ffd700'}),
                html.Div("Total Suppliers")
            ], style={'background': 'rgba(255, 255, 255, 0.1)', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center', 'width': '23%', 'display': 'inline-block', 'margin': '1%'}),
            
            html.Div([
                html.Div("3", style={'fontSize': '2em', 'fontWeight': 'bold', 'color': '#ffd700'}),
                html.Div("High Risk Suppliers")
            ], style={'background': 'rgba(255, 255, 255, 0.1)', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center', 'width': '23%', 'display': 'inline-block', 'margin': '1%'}),
            
            html.Div([
                html.Div("5", style={'fontSize': '2em', 'fontWeight': 'bold', 'color': '#ffd700'}),
                html.Div("Vulnerable Links")
            ], style={'background': 'rgba(255, 255, 255, 0.1)', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center', 'width': '23%', 'display': 'inline-block', 'margin': '1%'}),
            
            html.Div([
                html.Div("68%", style={'fontSize': '2em', 'fontWeight': 'bold', 'color': '#ffd700'}),
                html.Div("Overall Risk Score")
            ], style={'background': 'rgba(255, 255, 255, 0.1)', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center', 'width': '23%', 'display': 'inline-block', 'margin': '1%'})
        ], style={'marginBottom': '30px'}),
        
        html.H3("Critical Vulnerabilities"),
        html.Div([
            html.H4("🚨 Critical Vulnerability Detected"),
            html.P("Supplier: Rare Metals Co (China) - Tier 3"),
            html.P("Risk: Single source dependency for critical rare earth materials"),
            html.P("Impact: Complete production halt if disrupted")
        ], style={
            'background': 'rgba(255, 255, 255, 0.1)',
            'borderLeft': '4px solid #f44336',
            'padding': '15px',
            'margin': '10px 0',
            'borderRadius': '0 8px 8px 0'
        }),
        
        html.Div([
            html.H4("⚠️ Medium Risk Identified"),
            html.P("Supplier: Electronics Ltd (Germany)"),
            html.P("Risk: Geopolitical tensions affecting supply routes"),
            html.P("Impact: Potential delays in component delivery")
        ], style={
            'background': 'rgba(255, 255, 255, 0.1)',
            'borderLeft': '4px solid #ff9800',
            'padding': '15px',
            'margin': '10px 0',
            'borderRadius': '0 8px 8px 0'
        })
    ])

def recommendations_tab_content():
    return html.Div([
        html.H2("AI-Generated Recommendations"),
        
        html.Div([
            html.H4("🎯 Primary Recommendation"),
            html.P("Alternative Supplier: Identify domestic rare earth processing facility"),
            html.P("Action: Diversify Tier 3 suppliers for critical materials"),
            html.P("Timeline: 6-12 months"),
            html.P("Risk Reduction: 45%")
        ], style={
            'background': 'rgba(255, 255, 255, 0.1)',
            'borderLeft': '4px solid #4CAF50',
            'padding': '15px',
            'margin': '10px 0',
            'borderRadius': '0 8px 8px 0'
        }),
        
        html.Div([
            html.H4("💼 Secondary Recommendation"),
            html.P("Strategic Partnership: Establish long-term contracts with Australian raw material suppliers"),
            html.P("Benefits: Stable supply, reduced geopolitical risk"),
            html.P("Investment Required: Medium")
        ], style={
            'background': 'rgba(255, 255, 255, 0.1)',
            'borderLeft': '4px solid #4CAF50',
            'padding': '15px',
            'margin': '10px 0',
            'borderRadius': '0 8px 8px 0'
        }),
        
        html.Div([
            html.H4("🛡️ Risk Mitigation"),
            html.P("Buffer Stock: Maintain 6-month inventory for critical components"),
            html.P("Monitoring: Implement real-time supply chain monitoring"),
            html.P("Backup Plans: Develop alternative sourcing strategies")
        ], style={
            'background': 'rgba(255, 255, 255, 0.1)',
            'borderLeft': '4px solid #4CAF50',
            'padding': '15px',
            'margin': '10px 0',
            'borderRadius': '0 8px 8px 0'
        }),
        
        html.Button('📄 Generate Detailed Action Plan', id='action-plan-btn', n_clicks=0, className='btn', style={'marginTop': '20px'})
    ])

def reports_tab_content():
    return html.Div([
        html.H2("Supply Chain Reports & Analytics"),
        
        html.Div([
            html.Label("Report Type"),
            dcc.Dropdown(
                id='report-type',
                options=[
                    {'label': 'Vulnerability Assessment Report', 'value': 'vulnerability'},
                    {'label': 'Supplier Risk Analysis', 'value': 'supplier'},
                    {'label': 'Alternative Supplier Recommendations', 'value': 'alternative'},
                    {'label': 'Compliance & Ownership Report', 'value': 'compliance'}
                ],
                value='vulnerability',
                style={'marginBottom': '20px'}
            )
        ]),
        
        html.Div([
            html.Label("Export Format"),
            dcc.Dropdown(
                id='report-format',
                options=[
                    {'label': 'PDF Report', 'value': 'pdf'},
                    {'label': 'Excel Spreadsheet', 'value': 'excel'},
                    {'label': 'JSON Data', 'value': 'json'}
                ],
                value='pdf',
                style={'marginBottom': '20px'}
            )
        ]),
        
        html.Button('📊 Generate & Export Report', id='export-report-btn', n_clicks=0, className='btn'),
        
        html.Div([
            html.H3("Recent Analysis Results"),
            html.Div([
                html.P("• Equipment: Advanced Radar System - Risk Level: High"),
                html.P("• Critical Path: Tier 3 → Tier 2 → Tier 1 identified"),
                html.P("• Alternative suppliers: 3 options found"),
                html.P(f"• Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
            ])
        ], style={
            'background': 'rgba(0, 0, 0, 0.3)',
            'borderRadius': '15px',
            'padding': '25px',
            'marginTop': '20px'
        })
    ])

# Additional callbacks for interactivity
@app.callback(
    Output('equipment-name', 'value'),
    [Input('map-chain-btn', 'n_clicks')],
    prevent_initial_call=True
)
def map_supply_chain(n_clicks):
    if n_clicks > 0:
        return "Equipment mapped successfully!"
    return ""

@app.callback(
    Output('supplier-name', 'value'),
    [Input('add-supplier-btn', 'n_clicks')],
    prevent_initial_call=True
)
def add_supplier(n_clicks):
    if n_clicks > 0:
        return "Supplier added successfully!"
    return ""

if __name__ == '__main__':
    # Ensure database exists
    if not os.path.exists("data/supply_chain.db"):
        print("Setting up database...")
        os.makedirs("data", exist_ok=True)
        os.chdir("utils")
        from database_setup import setup_database
        setup_database()
        os.chdir("..")
        print("Database ready!")
    
    print("Starting LinkGuard...")
    print("Application will be available at: http://localhost:8080")
    print("Login with: admin / admin@admin.com")
    app.run(debug=False, host='0.0.0.0', port=8080)