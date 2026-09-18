import dash
from dash import dcc, html, Input, Output, callback, dash_table
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import requests
import json
import networkx as nx
from datetime import datetime

# Initialize Dash app
app = dash.Dash(__name__)
app.title = "LinkGuard Supply Chain Dashboard"

# Backend API base URL
API_BASE = "http://localhost:8001"

# App layout
app.layout = html.Div([
    html.Div([
        html.H1("LinkGuard Supply Chain Risk Management", 
                style={'textAlign': 'center', 'color': '#2c3e50', 'marginBottom': '30px'}),
        
        # Upload section
        html.Div([
            html.H3("Data Upload"),
            dcc.Upload(
                id='upload-data',
                children=html.Div([
                    'Drag and Drop or ',
                    html.A('Select Files')
                ]),
                style={
                    'width': '100%', 'height': '60px', 'lineHeight': '60px',
                    'borderWidth': '1px', 'borderStyle': 'dashed',
                    'borderRadius': '5px', 'textAlign': 'center', 'margin': '10px'
                },
                multiple=False
            ),
            html.Div(id='upload-output')
        ], style={'marginBottom': '30px'}),
        
        # Control buttons
        html.Div([
            html.Button('Refresh Data', id='refresh-btn', n_clicks=0, 
                       style={'marginRight': '10px', 'padding': '10px 20px'}),
            html.Button('Generate Report', id='report-btn', n_clicks=0,
                       style={'marginRight': '10px', 'padding': '10px 20px'}),
            html.Button('Sync Models', id='sync-btn', n_clicks=0,
                       style={'padding': '10px 20px'})
        ], style={'marginBottom': '30px'}),
        
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
            html.Div("Select a component to see alternative suppliers", id='recommendations-output')
        ], style={'marginTop': '30px'})
        
    ], style={'margin': '20px'})
])

# Callbacks
@app.callback(
    Output('network-graph', 'figure'),
    Input('refresh-btn', 'n_clicks')
)
def update_network_graph(n_clicks):
    """Update the supply chain network graph"""
    try:
        response = requests.get(f"{API_BASE}/graph")
        if response.status_code == 200:
            graph_data = response.json()['graph']
            
            # Create network visualization
            fig = go.Figure()
            
            # Add edges
            edge_x = []
            edge_y = []
            for edge in graph_data['edges']:
                # For simplicity, use random positions
                # In production, use proper graph layout algorithms
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
                
                # Color by risk score
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
                title="Supply Chain Network (Color: Green=Low Risk, Orange=Medium, Red=High)",
                showlegend=False,
                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                plot_bgcolor='white'
            )
            
            return fig
        
    except Exception as e:
        print(f"Error updating network graph: {e}")
    
    # Return empty figure if error
    return go.Figure()

@app.callback(
    [Output('risk-chart', 'figure'), Output('risk-table', 'data'), Output('risk-stats', 'children')],
    Input('refresh-btn', 'n_clicks')
)
def update_risk_data(n_clicks):
    """Update risk summary chart and table"""
    try:
        response = requests.get(f"{API_BASE}/risk_summary")
        if response.status_code == 200:
            risk_data = response.json()['high_risk_suppliers']
            
            if risk_data:
                df = pd.DataFrame(risk_data)
                
                # Create risk distribution chart
                fig = px.bar(df.head(10), x='name', y='risk_score', 
                           title='Top 10 High Risk Suppliers',
                           color='risk_score',
                           color_continuous_scale='Reds')
                fig.update_xaxes(tickangle=45)
                
                # Risk statistics
                total_suppliers = len(df)
                high_risk_count = len(df[df['risk_score'] > 0.7])
                avg_risk = df['risk_score'].mean()
                
                stats = html.Div([
                    html.P(f"Total High-Risk Suppliers: {high_risk_count}"),
                    html.P(f"Average Risk Score: {avg_risk:.2f}"),
                    html.P(f"Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
                ])
                
                return fig, df.to_dict('records'), stats
    
    except Exception as e:
        print(f"Error updating risk data: {e}")
    
    # Return empty data if error
    empty_fig = go.Figure()
    empty_fig.update_layout(title="No Risk Data Available")
    return empty_fig, [], html.Div("No data available")

@app.callback(
    Output('upload-output', 'children'),
    Input('upload-data', 'contents'),
    prevent_initial_call=True
)
def handle_file_upload(contents):
    """Handle file upload"""
    if contents is not None:
        try:
            # In a real implementation, you would process the file content
            # and send it to the backend API
            return html.Div([
                html.P("File uploaded successfully!", style={'color': 'green'}),
                html.P("Note: File processing would be implemented here.")
            ])
        except Exception as e:
            return html.Div([
                html.P(f"Error uploading file: {str(e)}", style={'color': 'red'})
            ])
    
    return html.Div()

@app.callback(
    Output('recommendations-output', 'children'),
    Input('risk-table', 'active_cell'),
    prevent_initial_call=True
)
def show_recommendations(active_cell):
    """Show alternative supplier recommendations"""
    if active_cell:
        try:
            # Mock recommendations for demonstration
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
            return html.Div(f"Error loading recommendations: {str(e)}")
    
    return html.Div("Select a supplier to see recommendations")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)