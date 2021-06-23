import urllib
import os

conn_str_env = os.getenv('SQLAZURECONNSTR_GameDB')
if conn_str_env:
    params = urllib.parse.quote_plus(conn_str_env)
    conn_str = 'mssql+pyodbc:///?odbc_connect={}'.format(params)
else:
    conn_str = 'sqlite:///db.sqlite'
    

class Config:
    SECRET_KEY = ''
    SQLALCHEMY_DATABASE_URI = conn_str
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    INSTRUMENTATION_KEY = ''
    CONNECTION_STRING = f'InstrumentationKey={INSTRUMENTATION_KEY};IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/'
    OPENCENSUS = {
        'TRACE': {
            'SAMPLER': 'opencensus.trace.samplers.ProbabilitySampler(rate=1.0)',
            'EXPORTER': f'opencensus.ext.azure.trace_exporter.AzureExporter(connection_string="{CONNECTION_STRING}", instrumentation_key="{INSTRUMENTATION_KEY}")'
        }
    }