terraform {
  backend "s3" {
    bucket                  = "terraform-s3-state-jh-eva"
    key                     = "euros-vote-app"
    region                  = "eu-west-1"
    shared_credentials_file = "~/.aws/credentials"
  }
}