# Setup

Create ec2 key pair and save locally on your machine
update key name in .env file

Also populate your AWS Account Number and region in .env file


```
npm run deploy
```

Add new SSH host: in VSCode with action panel run "Remote-SSH: Add new SSH Host"
```
ssh -i "path-to-key-file" ubuntu@<instance-public-dns> # public dns looks like ec2-3-121-112-32.eu-central-1.compute.amazonaws.com
```

Connect to machine: with action panel run "Remote-SSH: Connect to Host"

Run below commands on instance
```
sudo apt update
sudo apt-get install build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm install v14.17.0
echo 'export NPM_TOKEN=<your-npm-token>' >> ~/.bashrc
npm install --global yarn
git clone https://<github-user>:<personal-token>@github.com/mazedesignhq/maze-monorepo.git
cd maze-monorepo
yarn
```