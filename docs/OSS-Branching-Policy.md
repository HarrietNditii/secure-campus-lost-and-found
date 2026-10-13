### OSS Branching-Policy Summary: Kubernetes

The Kubernetes open-source project uses a structured contribution process to manage changes from multiple contributors while maintaining software quality. According to the Kubernetes documentation contribution guidelines, contributors must select the appropriate target branch before submitting a pull request. For example, current English documentation is generally submitted to the `main` branch, while documentation related to a particular feature release may target a version-specific branch such as `dev-1.38`.

Kubernetes uses pull requests to propose, review, test and merge changes. Contributors are expected to follow project conventions, write meaningful commit messages, keep changes manageable, and respond to review feedback. Before merging, changes must pass the required checks and receive the necessary approvals. The Kubernetes documentation review process distinguishes between reviewers, who provide binding technical feedback, and approvers, who authorize changes for merging. Its broader contribution guidance also emphasizes testing, clear explanations and collaboration.

This approach demonstrates that branching and change control are not only about storing code; they also help maintain traceability, prevent defects and ensure that changes are reviewed before integration.

For the Secure Campus Lost and Found System, I will adopt a simpler GitHub Flow strategy. Unlike a large project such as Kubernetes, my project is initially managed by one student and does not require multiple long-lived development or release branches. I will maintain a stable `main` branch and create short-lived feature or fix branches for individual changes. Each change will be associated with a GitHub issue and merged through a pull request after testing. This adapts the quality-control principles of Kubernetes to a smaller project.

**References**

- Kubernetes documentation contribution guidelines: https://github.com/kubernetes/website/blob/main/CONTRIBUTING.md
- Kubernetes pull request process: https://www.kubernetes.dev/docs/guide/pull-requests/
- Kubernetes roles and responsibilities: https://kubernetes.io/docs/contribute/participate/roles-and-responsibilities/