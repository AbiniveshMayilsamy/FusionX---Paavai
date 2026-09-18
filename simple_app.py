import dash
from dash import dcc, html, Input, Output, State
import plotly.graph_objects as go
import pandas as pd
from datetime import datetime

app = dash.Dash(__name__)

# Simple login layout
def login_page():
    return html.Div([
        html.Div([
            html.H1("LinkGuard", style={
                'fontSize': '4em',
                'color': '#ffd700',
                'textAlign': 'center',
                'marginBottom': '20px'
            }),
            html.P("AI Supply Chain Risk Management", style={
                'textAlign': 'center',
                'color': '#fff',
                'marginBottom': '40px'
            }),
            
            html.Div([
                dcc.Dropdown(
                    id='user-type',
                    options=[
                        {'label': 'Administrator', 'value': 'admin'},
                        {'label': 'Analyst', 'value': 'analyst'}
                    ],
                    value='admin',
                    style={'marginBottom': '20px'}
                ),
                dcc.Input(
                    id='username',
                    placeholder='Username',
                    value='admin',
                    style={'width': '100%', 'padding': '10px', 'marginBottom': '20px'}
                ),
                dcc.Input(
                    id='email',
                    placeholder='Email',
                    value='admin@admin.com',
                    style={'width': '100%', 'padding': '10px', 'marginBottom': '20px'}
                ),
                html.Button('Login', id='login-btn', n_clicks=0, style={
                    'width': '100%',
                    'padding': '15px',
                    'background': '#ffd700',
                    'border': 'none',
                    'borderRadius': '5px',
                    'fontSize': '16px'
                })
            ], style={
                'maxWidth': '400px',
                'margin': '0 auto',
                'background': 'rgba(255,255,255,0.1)',
                'padding': '40px',
                'borderRadius': '15px'
            })
        ], style={
            'minHeight': '100vh',
            'background': 'linear-gradient(135deg, #1e3c72, #2a5298)',
            'color': '#fff',
            'display': 'flex',
            'alignItems': 'center',
            'justifyContent': 'center'
        }),
        
        html.Div([
            html.P("Developed by GaneshPrabu"),
            html.P("+91-7338703622"),
            html.P("ganeshprabu.bo2024@sece.ac.in")
        ], style={
            'position': 'fixed',
            'bottom': '20px',
            'right': '20px',
            'color': '#ccc',
            'fontSize': '12px'
        })
    ])

# Dashboard layout
def dashboard_page():
    return html.Div([
        # Header
        html.Div([
            html.H1("🛡️ LinkGuard Supply Chain Management", style={
                'color': '#ffd700',
                'textAlign': 'center'
            }),
            html.Button('Logout', id='logout-btn', n_clicks=0, style={
                'position': 'absolute',
                'top': '20px',
                'right': '20px',
                'background': '#f44336',
                'color': 'white',
                'border': 'none',
                'padding': '10px 20px',
                'borderRadius': '5px'
            })
        ], style={
            'background': 'rgba(0,0,0,0.3)',
            'padding': '30px',
            'borderRadius': '15px',
            'marginBottom': '30px',
            'position': 'relative'
        }),
        
        # Input forms
        html.Div([
            html.Div([
                html.H3("Equipment Registration"),
                dcc.Input(id='equipment-name', placeholder='Equipment Name', style={'width': '100%', 'padding': '10px', 'marginBottom': '10px'}),
                dcc.Dropdown(
                    id='equipment-type',
                    options=[
                        {'label': 'Electronics', 'value': 'electronics'},
                        {'label': 'Weapon System', 'value': 'weapon'},
                        {'label': 'Vehicle', 'value': 'vehicle'}
                    ],
                    placeholder='Select Type',
                    style={'marginBottom': '10px'}
                ),
                html.Button('Map Supply Chain', id='map-btn', n_clicks=0, style={
                    'width': '100%',
                    'padding': '10px',
                    'background': '#ffd700',
                    'border': 'none',
                    'borderRadius': '5px'
                })
            ], style={
                'background': 'rgba(255,255,255,0.1)',
                'padding': '20px',
                'borderRadius': '15px',
                'width': '48%',
                'display': 'inline-block'
            }),
            
            html.Div([
                html.H3("Supplier Input"),
                dcc.Input(id='supplier-name', placeholder='Supplier Name', style={'width': '100%', 'padding': '10px', 'marginBottom': '10px'}),
                dcc.Input(id='supplier-country', placeholder='Country', style={'width': '100%', 'padding': '10px', 'marginBottom': '10px'}),
                html.Button('Add Supplier', id='add-btn', n_clicks=0, style={
                    'width': '100%',
                    'padding': '10px',
                    'background': '#ffd700',
                    'border': 'none',
                    'borderRadius': '5px'
                })
            ], style={
                'background': 'rgba(255,255,255,0.1)',
                'padding': '20px',
                'borderRadius': '15px',
                'width': '48%',
                'display': 'inline-block',
                'marginLeft': '4%'
            })
        ], style={'marginBottom': '30px'}),
        
        # Tabs
        html.Div([
            html.Button('Supply Chain Map', id='tab1', n_clicks=1, style={'flex': '1', 'padding': '15px', 'background': '#ffd700', 'border': 'none'}),
            html.Button('Risk Analysis', id='tab2', n_clicks=0, style={'flex': '1', 'padding': '15px', 'background': 'rgba(0,0,0,0.3)', 'border': 'none', 'color': 'white'}),
            html.Button('Reports', id='tab3', n_clicks=0, style={'flex': '1', 'padding': '15px', 'background': 'rgba(0,0,0,0.3)', 'border': 'none', 'color': 'white'})
        ], style={'display': 'flex', 'marginBottom': '20px', 'borderRadius': '10px', 'overflow': 'hidden'}),
        
        # Tab content
        html.Div(id='tab-content'),
        
        # Footer
        html.Div([
            html.P("Developed by GaneshPrabu | +91-7338703622 | ganeshprabu.bo2024@sece.ac.in")
        ], style={'textAlign': 'center', 'color': '#ccc', 'marginTop': '30px'})
        
    ], style={
        'maxWidth': '1200px',
        'margin': '0 auto',
        'padding': '20px',
        'background': 'linear-gradient(135deg, #1e3c72, #2a5298)',
        'minHeight': '100vh',
        'color': '#fff'
    })

# App layout
app.layout = html.Div([
    dcc.Store(id='session', data={'logged_in': False}),
    html.Div(id='page-content')
])

# Callbacks
@app.callback(
    Output('page-content', 'children'),
    Input('session', 'data')
)
def display_page(session):
    if session.get('logged_in'):
        return dashboard_page()
    return login_page()

@app.callback(
    Output('session', 'data'),
    Input('login-btn', 'n_clicks'),
    State('username', 'value'),
    State('email', 'value')
)
def login(n_clicks, username, email):
    if n_clicks > 0 and username == 'admin' and email == 'admin@admin.com':
        return {'logged_in': True}
    return {'logged_in': False}

@app.callback(
    Output('session', 'data', allow_duplicate=True),
    Input('logout-btn', 'n_clicks'),
    prevent_initial_call=True
)
def logout(n_clicks):
    if n_clicks > 0:
        return {'logged_in': False}
    return {'logged_in': True}

@app.callback(
    Output('tab-content', 'children'),
    [Input('tab1', 'n_clicks'),
     Input('tab2', 'n_clicks'),
     Input('tab3', 'n_clicks')]
)
def update_tab(tab1, tab2, tab3):
    ctx = dash.callback_context
    if not ctx.triggered:
        return supply_chain_tab()
    
    button_id = ctx.triggered[0]['prop_id'].split('.')[0]
    
    if button_id == 'tab1':
        return supply_chain_tab()
    elif button_id == 'tab2':
        return risk_analysis_tab()
    elif button_id == 'tab3':
        return reports_tab()

def supply_chain_tab():
    return html.Div([
        html.H3("Multi-Tier Supply Chain Visualization"),
        html.Div([
            html.Div([
                html.H4("Tier 1", style={'color': '#ffd700'}),
                html.Div("Primary Defense Corp", style={
                    'background': '#4CAF50',
                    'padding': '15px',
                    'borderRadius': '10px',
                    'textAlign': 'center',
                    'margin': '10px'
                })
            ]),
            html.Div([
                html.H4("Tier 2", style={'color': '#ffd700'}),
                html.Div("Electronics Ltd", style={
                    'background': '#ff9800',
                    'padding': '15px',
                    'borderRadius': '10px',
                    'textAlign': 'center',
                    'margin': '10px',
                    'display': 'inline-block',
                    'width': '45%'
                }),
                html.Div("Steel Industries", style={
                    'background': '#4CAF50',
                    'padding': '15px',
                    'borderRadius': '10px',
                    'textAlign': 'center',
                    'margin': '10px',
                    'display': 'inline-block',
                    'width': '45%'
                })
            ]),
            html.Div([
                html.H4("Tier 3", style={'color': '#ffd700'}),
                html.Div("Rare Metals Co (HIGH RISK)", style={
                    'background': '#f44336',
                    'padding': '15px',
                    'borderRadius': '10px',
                    'textAlign': 'center',
                    'margin': '10px',
                    'animation': 'pulse 2s infinite'
                })
            ])
        ], style={
            'background': 'rgba(0,0,0,0.2)',
            'padding': '20px',
            'borderRadius': '10px'
        })
    ])

def risk_analysis_tab():
    return html.Div([
        html.H3("Risk Assessment Dashboard"),
        html.Div([
            html.Div([
                html.H2("12", style={'color': '#ffd700', 'fontSize': '2em'}),
                html.P("Total Suppliers")
            ], style={'background': 'rgba(255,255,255,0.1)', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center', 'width': '23%', 'display': 'inline-block', 'margin': '1%'}),
            
            html.Div([
                html.H2("3", style={'color': '#ffd700', 'fontSize': '2em'}),
                html.P("High Risk")
            ], style={'background': 'rgba(255,255,255,0.1)', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center', 'width': '23%', 'display': 'inline-block', 'margin': '1%'}),
            
            html.Div([
                html.H2("68%", style={'color': '#ffd700', 'fontSize': '2em'}),
                html.P("Risk Score")
            ], style={'background': 'rgba(255,255,255,0.1)', 'padding': '20px', 'borderRadius': '10px', 'textAlign': 'center', 'width': '23%', 'display': 'inline-block', 'margin': '1%'})
        ]),
        
        html.Div([
            html.H4("🚨 Critical Vulnerability"),
            html.P("Supplier: Rare Metals Co (China)"),
            html.P("Risk: Single source dependency"),
            html.P("Impact: Production halt if disrupted")
        ], style={
            'background': 'rgba(255,255,255,0.1)',
            'borderLeft': '4px solid #f44336',
            'padding': '15px',
            'margin': '20px 0',
            'borderRadius': '0 8px 8px 0'
        })
    ])

def reports_tab():
    return html.Div([
        html.H3("Supply Chain Reports"),
        html.Div([
            dcc.Dropdown(
                options=[
                    {'label': 'Vulnerability Report', 'value': 'vuln'},
                    {'label': 'Risk Analysis', 'value': 'risk'},
                    {'label': 'Supplier Report', 'value': 'supplier'}
                ],
                value='vuln',
                style={'marginBottom': '20px'}
            ),
            html.Button('Generate Report', style={
                'padding': '15px 30px',
                'background': '#ffd700',
                'border': 'none',
                'borderRadius': '5px',
                'fontSize': '16px'
            })
        ]),
        
        html.Div([
            html.H4("Recent Results"),
            html.P("• Equipment: Advanced Radar System - Risk: High"),
            html.P("• Critical suppliers identified: 3"),
            html.P(f"• Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        ], style={
            'background': 'rgba(0,0,0,0.3)',
            'padding': '20px',
            'borderRadius': '10px',
            'marginTop': '20px'
        })
    ])

if __name__ == '__main__':
    print("Starting LinkGuard...")
    print("Go to: http://localhost:8080")
    print("Login: admin / admin@admin.com")
    app.run(debug=True, host='0.0.0.0', port=8080)