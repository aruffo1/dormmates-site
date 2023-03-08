# Credentials Folder

## The purpose of this folder is to store all credentials needed to log into your server and databases. This is important for many reasons. But the two most important reasons is
    1. Grading , servers and databases will be logged into to check code and functionality of application. Not changes will be unless directed and coordinated with the team.
    2. Help. If a class TA or class CTO needs to help a team with an issue, this folder will help facilitate this giving the TA or CTO all needed info AND instructions for logging into your team's server. 


# Below is a list of items required. Missing items will causes points to be deducted from multiple milestone submissions.

## Credentials:

1. **Server URL**: 54.193.147.35
2. **SSH username**: ubuntu
3. **SSH key**: `aws-key.pem`
4. **Database URL**: csc648-mysql-1.ct1zlxdmcbvw.us-west-1.rds.amazonaws.com
5. **Database username**: admin
6. **Database password**: cHY4C05PAXEdHh1tzXvk
7. **Database name**: dormmates


### How to connect to the AWS EC2 instance:
1. Download `aws-key.pem` from this folder.
2. Open a terminal and navigate to where you downloaded `aws-key.pem`.
3. Run `chmod 400 aws-key.pem` to ensure that the key is not publicly viewable.
4. Use the key to connect via ssh with `ssh -i "aws-key.pem" ubuntu@54.193.147.35`.

### How to connect to the AWS RDS MySQL instance:
* To connect via workbench use the details above and connect with `Standard (TCP/IP)`.
* To connect via the terminal run `mysql -h
  csc648-mysql-1.ct1zlxdmcbvw.us-west-1.rds.amazonaws.com -u admin -p` and enter
  the password listed above when prompted.

# Most important things to Remember
## These values need to kept update to date throughout the semester. <br>
## <strong>Failure to do so will result it points be deducted from milestone submissions.</strong><br>
## You may store the most of the above in this README.md file. DO NOT Store the SSH key or any keys in this README.md file.
