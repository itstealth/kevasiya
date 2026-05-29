import yaml

with open('docker-compose.production.yml') as f:
    d = yaml.safe_load(f)

d['services']['frontend']['build']['context'] = '.'
d['services']['frontend']['command'] = ['node', 'server.js']
d['services']['backend']['build']['context'] = '.'

with open('docker-compose.production.yml', 'w') as f:
    yaml.dump(d, f)
