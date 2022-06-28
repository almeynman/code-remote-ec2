# Summary

This [CDK app](https://github.com/aws/aws-cdk) deploys Ubuntu machine and explains how to connect to it via VS Code to run the development environment with all its dependencies.

# Setup

Create ec2 key pair on AWS side and save locally on your machine
update key name in .env file

Also populate your AWS Account Number and region in .env file


```
npm install
```
```
npm run deploy
```

Add new SSH host: in VSCode with action panel run "Remote-SSH: Add new SSH Host"
```
ssh -i "path-to-key-file" ubuntu@<instance-public-dns> 

# public dns looks like ec2-3-121-112-32.eu-central-1.compute.amazonaws.com
# key-file is the one you created in step 1
```

Connect to machine: with action panel run "Remote-SSH: Connect to Host"

Open terminal and run below commands on instance
```
sudo apt update
sudo apt-get install build-essential

# nvm, npm, node, yarn
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm install 14.17.0
echo 'export NPM_TOKEN=<your-npm-token>' >> ~/.bashrc
source ~/.bashrc
npm install --global yarn

# docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo groupadd docker
sudo usermod -aG docker $USER
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# repo
git clone https://<github-user>:<personal-token>@github.com/<username>/<repository-name>.git
cd <repository-name>
```

Reboot your instance

Now in VS Code you can open your repository

Follow instructions from your repository

# Change AMI Image

You might want to deploy a different [AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html) image if you change AWS region or the OS of the image. For this modify [this line](https://github.com/almeynman/code-remote-ec2/blob/ac4dab34b32fab4689e4101eccf2442e65b24bfa/lib/code-remote-ec2-stack.ts#L47). [AMI selection](https://cloud-images.ubuntu.com/locator/ec2/)






