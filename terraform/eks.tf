resource "aws_iam_role" "euros-vote-app-eks-role" {
  name = "euros-vote-app-eks-role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "euros-vote-app-AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.euros-vote-app-eks-role.name
}

resource "aws_eks_cluster" "euros-vote-app" {
  name     = "euros-vote-app"
  role_arn = aws_iam_role.euros-vote-app-eks-role.arn

  vpc_config {
    subnet_ids = [
      aws_subnet.private-eu-west-1a.id,
      aws_subnet.private-eu-west-1b.id,
      aws_subnet.public-eu-west-1a.id,
      aws_subnet.public-eu-west-1b.id
    ]
  }

  depends_on = [aws_iam_role_policy_attachment.euros-vote-app-AmazonEKSClusterPolicy]
}

# resource "aws_eks_addon" "vpc_cni" {
#   cluster_name = aws_eks_cluster.euros-vote-app.name
#   addon_name   = "vpc-cni"
# }

# resource "aws_eks_addon" "kube_proxy" {
#   cluster_name = aws_eks_cluster.euros-vote-app.name
#   addon_name   = "kube-proxy"
# }

# resource "aws_eks_addon" "core_dns" {
#   cluster_name = aws_eks_cluster.euros-vote-app.name
#   addon_name   = "coredns"
# }

# resource "aws_eks_addon" "eks-pod-identity-agent" {
#   cluster_name = aws_eks_cluster.euros-vote-app.name
#   addon_name   = "eks-pod-identity"
# }

# resource "aws_eks_addon" "aws-ebs-csi-driver" {
#   cluster_name = aws_eks_cluster.euros-vote-app.name
#   addon_name   = "ebs-csi-driver"
# }
