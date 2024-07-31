resource "aws_vpc" "euros-vote-app" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "euros-vote-app"
  }
}
