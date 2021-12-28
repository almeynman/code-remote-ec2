import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class CodeRemoteEc2Stack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 1,
      cidr: "10.0.0.0/21",
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: "subnetPub",
          cidrMask: 24,
        },
      ],
    });

    const secGrp = new ec2.SecurityGroup(this, "CsSg", {
      vpc: vpc,
      securityGroupName: "csSg",
      description: "Allow HTTP traffic to EC2 instance from anywhere",
      allowAllOutbound: true,
    });

    secGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.allTcp(), // Code-Server listen on 8080 port
      "Allow all traffic"
    );
    // secGrp.addIngressRule(
    //   ec2.Peer.anyIpv4(),
    //   ec2.Port.tcp(8080), // Code-Server listen on 8080 port
    //   "Allow ingress HTTP traffic"
    // );
    // secGrp.addIngressRule(
    //   ec2.Peer.anyIpv4(),
    //   ec2.Port.tcp(22),
    //   "Allow ingress SSH traffic"
    // );

    // https://cloud-images.ubuntu.com/locator/ec2/
    // owner: 099720109477 (ubuntu)
    const imgLinuxUbu = new ec2.GenericLinuxImage({
      "eu-central-1": "ami-0d527b8c289b4af7f", //  Ubuntu Server 20.04 LTS amd64
    });

    const instance = new ec2.Instance(this, "CsEc2Instance", {
      vpc: vpc,
      machineImage: imgLinuxUbu,
      instanceName: "code-server-ec2",
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MEDIUM
      ),
      securityGroup: secGrp,
      blockDevices: [{
        deviceName: '/dev/sda1', // Use the root device name from Step 1
      volume: ec2.BlockDeviceVolume.ebs(64), // Override the volume size in Gibibytes (GiB)
      }]
    });

    instance.addUserData(`#!/bin/sh

cd /home/ubuntu
sudo apt update
sudo apt-get install build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
nvm install v14.17.0
echo 'export NPM_TOKEN=${process.env.NPM_TOKEN}' >> ~/.bashrc
npm install --global yarn
echo 'custom initialization complete

https://github.com/mazedesignhq/maze-monorepo.git
git clone https://${process.env.GITHUB_USER}:${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/mazedesignhq/maze-monorepo.git
cd maze-monorepo
yarn
`)
    instance.instance.addPropertyOverride("KeyName", "almas-macbook-pro-2020");
  }
}
