#!/bin/bash

pnpm run build

zip -r dist.zip ./dist

ssh root@89.223.69.2 'rm -rf /opt/frontend/dist'

scp -r ./dist.zip root@89.223.69.2:/opt/frontend/

ssh root@89.223.69.2 'cd /opt/frontend/ && unzip -o dist.zip'

ssh root@89.223.69.2 'systemctl restart singularity@frontend.service'