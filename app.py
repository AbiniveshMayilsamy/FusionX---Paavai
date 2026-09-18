#!/usr/bin/env python3
"""
LinkGuard Unified Application
Single file that runs both backend API and frontend dashboard
"""

import dash
from dash import dcc, html, Input, Output, dash_table
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import sqlite3
import json
from datetime import datetime
import os
import sys

# Add backend modules to path
sys.path.append('backend')
from models import SupplyChainDB, RiskPredictor, GraphBuilder

# Initialize components
db = SupplyChainDB("data/supply_chain.db")
risk_predictor = RiskPredictor("models/risk_model.pkl")
graph_builder = GraphBuilder()

# Initialize Dash app
app = dash.Dash(__name__)
app.title = "LinkGuard Supply Chain Dashboard"

# App layout
app.layout = html.Div([
    html.Div([
        html.H1("LinkGuard Supply Chain Risk Management", 
                style={'textAlign': 'center', 'color': '#2c3e50', 'marginBottom': '30px'}),
        
        # Control buttons
        html.Div([
            html.Button('Refresh Data', id='refresh-btn', n_clicks=0, 
                       style={'marginRight': '10px', 'padding': '10px 20px', 'backgroundColor': '#3498db', 'color': 'white', 'border': 'none'}),
            html.Button('Train Model', id='train-btn', n_clicks=0,
                       style={'marginRight': '10px', 'padding': '10px 20px', 'backgroundColor': '#e74c3c', 'color': 'white', 'border': 'none'}),
        ], style={'marginBottom': '30px', 'textAlign': 'center'}),
        
        # Main dashboard content
        html.Div([
            # Left column - Network Graph
            html.Div([
                html.H3("Supply Chain Network"),
                dcc.Graph(id='network-graph', style={'height': '500px'})
            ], style={'width': '60%', 'display': 'inline-block', 'verticalAlign': 'top'}),
            
            # Right column - Risk Summary
            html.Div([
                html.H3("Risk Summary"),
                dcc.Graph(id='risk-chart', style={'height': '250px'}),
                html.Div(id='risk-stats', style={'marginTop': '20px'})
            ], style={'width': '38%', 'display': 'inline-block', 'verticalAlign': 'top', 'marginLeft': '2%'})
        ]),
        
        # Bottom section - High Risk Suppliers Table
        html.Div([
            html.H3("High Risk Suppliers"),
            dash_table.DataTable(
                id='risk-table',
                columns=[
                    {'name': 'Supplier', 'id': 'name'},
                    {'name': 'Country', 'id': 'country'},
                    {'name': 'Risk Score', 'id': 'risk_score', 'type': 'numeric', 'format': {'specifier': '.2f'}},
                    {'name': 'Reliability', 'id': 'reliability_score', 'type': 'numeric', 'format': {'specifier': '.2f'}}
                ],
                style_cell={'textAlign': 'left'},
                style_data_conditional=[
                    {
                        'if': {'filter_query': '{risk_score} > 0.7'},
                        'backgroundColor': '#ffebee',
                        'color': 'black',
                    }
                ],
                sort_action="native",
                page_size=10
            )
        ], style={'marginTop': '30px'}),
        
        # Recommendations section
        html.Div([
            html.H3("Alternative Supplier Recommendations"),
            html.Div(id='recommendations-output')
        ], style={'marginTop': '30px'})
        
    ], style={'margin': '20px'})
])

@app.callback(
    Output('network-graph', 'figure'),
    [Input('refresh-btn', 'n_clicks')]
)
def update_network_graph(n_clicks):
    """Update the supply chain network graph"""
    try:
        graph_data = graph_builder.build_network_graph()
        
        fig = go.Figure()
        
        # Add edges
        edge_x = []
        edge_y = []
        for edge in graph_data['edges']:
            source_x, source_y = hash(edge['source']) % 100, hash(edge['source']) % 100
            target_x, target_y = hash(edge['target']) % 100, hash(edge['target']) % 100
            
            edge_x.extend([source_x, target_x, None])
            edge_y.extend([source_y, target_y, None])
        
        fig.add_trace(go.Scatter(x=edge_x, y=edge_y, mode='lines', 
                               line=dict(width=1, color='gray'), 
                               hoverinfo='none', showlegend=False))
        
        # Add nodes
        node_x = []
        node_y = []
        node_text = []
        node_color = []
        
        for node in graph_data['nodes']:
            x, y = hash(node['id']) % 100, hash(node['id']) % 100
            node_x.append(x)
            node_y.append(y)
            node_text.append(f"{node['label']}<br>Risk: {node['risk_score']:.2f}")
            
            risk = node['risk_score']
            if risk > 0.7:
                node_color.append('red')
            elif risk > 0.4:
                node_color.append('orange')
            else:
                node_color.append('green')
        
        fig.add_trace(go.Scatter(x=node_x, y=node_y, mode='markers+text',
                               marker=dict(size=10, color=node_color),
                               text=[node['label'] for node in graph_data['nodes']],
                               textposition="middle center",
                               hovertext=node_text,
                               hoverinfo='text',
                               showlegend=False))
        
        fig.update_layout(
            title="Supply Chain Network (Green=Low Risk, Orange=Medium, Red=High)",
            showlegend=False,
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            plot_bgcolor='white'
        )
        
        return fig
        
    except Exception as e:
        print(f"Error: {e}")
        return go.Figure()

@app.callback(
    [Output('risk-chart', 'figure'), Output('risk-table', 'data'), Output('risk-stats', 'children')],
    [Input('refresh-btn', 'n_clicks')]
)
def update_risk_data(n_clicks):
    """Update risk summary chart and table"""
    try:
        risk_data = db.get_high_risk_suppliers(limit=20)
        
        if risk_data:
            df = pd.DataFrame(risk_data)
            
            # Create risk distribution chart
            fig = px.bar(df.head(10), x='name', y='risk_score', 
                       title='Top 10 High Risk Suppliers',
                       color='risk_score',
                       color_continuous_scale='Reds')
            fig.update_xaxes(tickangle=45)
            
            # Risk statistics
            high_risk_count = len(df[df['risk_score'] > 0.7])
            avg_risk = df['risk_score'].mean()
            
            stats = html.Div([
                html.P(f"Total High-Risk Suppliers: {high_risk_count}"),
                html.P(f"Average Risk Score: {avg_risk:.2f}"),
                html.P(f"Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
            ])
            
            return fig, df.to_dict('records'), stats
    
    except Exception as e:
        print(f"Error: {e}")
    
    empty_fig = go.Figure()
    empty_fig.update_layout(title="No Risk Data Available")
    return empty_fig, [], html.Div("No data available")

@app.callback(
    Output('recommendations-output', 'children'),
    [Input('risk-table', 'active_cell')],
    prevent_initial_call=True
)
def show_recommendations(active_cell):
    """Show alternative supplier recommendations"""
    if active_cell:
        try:
            recommendations = [
                {"name": "Alternative Supplier A", "country": "Germany", "risk_score": 0.3},
                {"name": "Alternative Supplier B", "country": "Japan", "risk_score": 0.25},
                {"name": "Alternative Supplier C", "country": "USA", "risk_score": 0.4}
            ]
            
            rec_table = dash_table.DataTable(
                data=recommendations,
                columns=[
                    {'name': 'Alternative Supplier', 'id': 'name'},
                    {'name': 'Country', 'id': 'country'},
                    {'name': 'Risk Score', 'id': 'risk_score', 'type': 'numeric', 'format': {'specifier': '.2f'}}
                ],
                style_cell={'textAlign': 'left'}
            )
            
            return html.Div([
                html.P("Recommended alternative suppliers:"),
                rec_table
            ])
        
        except Exception as e:
            return html.Div(f"Error: {str(e)}")
    
    return html.Div("Select a supplier to see recommendations")

@app.callback(
    Output('train-btn', 'children'),
    [Input('train-btn', 'n_clicks')],
    prevent_initial_call=True
)
def train_model(n_clicks):
    """Train the ML model"""
    if n_clicks > 0:
        try:
            metrics = risk_predictor.retrain_model()
            return f"Model Trained (Acc: {metrics.get('accuracy', 0):.2f})"
        except:
            return "Training Failed"
    return "Train Model"

if __name__ == '__main__':
    # Ensure database exists
    if not os.path.exists("data/supply_chain.db"):
        print("Setting up database...")
        os.chdir("utils")
        from database_setup import setup_database
        setup_database()
        os.chdir("..")
        print("Database ready!")
    
    print("Starting LinkGuard...")
    print("Dashboard will be available at: http://localhost:8080")
    app.run(debug=False, host='0.0.0.0', port=8080)