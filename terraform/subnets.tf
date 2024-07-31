resource "aws_subnet" "private-eu-west-1a" {
  vpc_id            = aws_vpc.euros-vote-app.id
  cidr_block        = "10.0.0.0/19"
  availability_zone = "eu-west-1a"

  tags = {
    "Name"                            = "private-eu-west-1a"
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/euros-vote-app"      = "owned"
  }
}

resource "aws_subnet" "private-eu-west-1b" {
  vpc_id            = aws_vpc.euros-vote-app.id
  cidr_block        = "10.0.32.0/19"
  availability_zone = "eu-west-1b"

  tags = {
    "Name"                            = "private-eu-east-1b"
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/euros-vote-app"      = "owned"
  }
}

resource "aws_subnet" "public-eu-west-1a" {
  vpc_id                  = aws_vpc.euros-vote-app.id
  cidr_block              = "10.0.64.0/19"
  availability_zone       = "eu-west-1a"
  map_public_ip_on_launch = true

  tags = {
    "Name"                       = "public-eu-west-1a"
    "kubernetes.io/role/elb"     = "1"
    "kubernetes.io/cluster/euros-vote-app" = "owned"
  }
}

resource "aws_subnet" "public-eu-west-1b" {
  vpc_id                  = aws_vpc.euros-vote-app.id
  cidr_block              = "10.0.96.0/19"
  availability_zone       = "eu-west-1b"
  map_public_ip_on_launch = true

  tags = {
    "Name"                       = "public-eu-west-1b"
    "kubernetes.io/role/elb"     = "1"
    "kubernetes.io/cluster/euros-vote-app" = "owned"
  }
}
