import yaml

with open('docker-compose.production.yml') as f:
    d = yaml.safe_load(f)

if 'fail2ban' in d['services']:
    del d['services']['fail2ban']

with open('docker-compose.production.yml', 'w') as f:
    yaml.dump(d, f)
