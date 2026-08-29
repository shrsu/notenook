# Notenook - Note Sharing Web App

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Deployed Links](#deployed-links)

## Introduction:

Notenook is a platform designed to help students share notes, engage in discussions, and connect with each other. It's built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and offers an easy-to-use interface for seamless collaboration.

## Features:

- **Post Notes Section**: Easily upload and share your notes with others, making learning a collaborative effort.
- **Profile Viewing**: Explore profiles of other students to find peers with similar interests and connect with them.
- **Connect and Follow**: Stay connected with other users and follow their activities to build a network of learning buddies.
- **Chat Functionality**: Chat in real-time with other users to discuss topics and collaborate on projects.
- **Text Editor for Creating Notes**: Create and format notes effortlessly using our intuitive text editor powered by Quill.
- **Discussion Forum**: Engage in discussions, share ideas, and seek help from the community in our dedicated discussion forum.

## Technology Stack:

- **Frontend:**
  - React.js
  - Quill
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB.
- **Additional Libraries and Tools:**
  - Socket.io.
  - Passport.js

## Deployed Links
### FrontEnd deployed link:
[Netlify Deployed link](https://notenook.netlify.app/)

## Contributing to Notenook

Thank you for your interest in contributing to Notenook! Please follow these steps:

### Fork the Repository

Start by forking the [Notenook repository](https://github.com/shrsu/notenook) on GitHub. This will create a copy of the repository under your GitHub account.

### Clone Your Fork

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/<your-username>/notenook.git
cd notenook
```

### Install Dependencies

Make sure you have Node.js and npm installed on your machine. Install project dependencies:

```bash
cd client
npm install
cd ../server
npm install
```

### Set Up Environment Variables

Create a `.env` files in the `cleint` and the `server` directory based on the provided `.env.example`. Fill in the necessary environment variables in both `client` and `server` directory.

### Submitting Changes

1. Make your desired changes to the codebase.
2. Go to your forked repository on GitHub.
3. Click on the **New pull request** button next to the `main` branch.
4. Provide a clear description of your changes in the pull request. Include any relevant details that can help reviewers understand your contribution.

