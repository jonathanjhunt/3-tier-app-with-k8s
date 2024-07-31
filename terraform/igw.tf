resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.euros-vote-app.id

  tags = {
    Name = "igw"
  }
}
