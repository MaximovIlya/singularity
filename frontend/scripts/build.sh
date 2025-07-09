#!/bin/bash

pnpm run build

zip -r dist.zip ./dist

ssh root@89.223.69.2 'rm -rf /opt/dist'

scp -r ./dist.zip root@89.223.69.2:/opt/

ssh root@89.223.69.2 'cd /opt/ && unzip -o dist.zip'

ssh root@89.223.69.2 'systemctl restart singularity@frontend.service'