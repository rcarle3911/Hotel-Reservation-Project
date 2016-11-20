# Hotel-Reservation-Project

This website will be designed using a MEAN stack. MEAN is comprised of MongoDB, Express, AngularJS, and Node.js. The website is running of off a ~~Raspberry Pi~~ [ODROID C2](http://www.hardkernel.com/main/products/prdt_info.php) that will pull files from this repository as needed. To set up a development environment, please follow the server installation steps.

# Documentation

All documents can be dumped in Google Drive. Here is the link 
* https://drive.google.com/drive/folders/0By5eYxjK61RceXg1WjYxYXBNa3c?usp=sharing.

##Mockup of Sites

Customer Front End 
* https://app.moqups.com/jordan.fournier/LvuF2bKdVi/view (Current Version)
* ~~https://app.moqups.com/brandingcraze/LZLHfAlWDl/view~~ (Previous Version)

Business Front End 
* https://app.moqups.com/jwmooreiv@gmail.com/cuc29MCJIU/view/page/a95c7641a

##Diagrams

Dataflow Diagram 
* https://www.lucidchart.com/invitations/accept/17bf75c8-30ee-410d-8377-cbcb63cc7bcd

# Server Installation Guide

## Install Node.js

Go to https://nodejs.org and install v7.0.0 for your operating system.

## Install MongoDB

Go to https://www.mongodb.com/download-center?jmp=hero#community and install v3.2.10 for your operating system. Windows 7 64 bit or later users should install the file for Windows Server 2008 R2 64 bit and later, with SSL support.

## Clone this repository

Make a git folder somewhere on your computer and clone this repository over to it. There are many ways to do this. I installed GitBash, but there are some GUI clients that will work as well.

Check out this Git/GitHub [tutorial](https://www.youtube.com/watch?v=vR-y_2zWrIE&index=1&list=PLWKjhJtqVAbkFiqHnNaxpOPhh9tSWMXIF).

## Install Dependencies

Once you have cloned the repository, you should have a hotel-reservation-project folder somewhere. Navigate to this folder via the command line. For example, if your folder is located here C:\git\hotel-reservation-project, you could type cd C:\git\hotel-reservation-project to get there. Alternively, Windows users could navigate via the file explorer to the folder, shift-right-click on it, and select open command window here.

Once you're there enter <b>npm install</b> to get all of the dependencies.

## Start Nodejs Server

To start the server, enter <b>node server</b> into the command window while in the project directory. It should say Server running on port 3000. If you visit localhost:3000 from your browser and the site comes up, everything is good to go. Terminate the command to stop the server.

## Set up Code Editor

You'll need something to edit the html and javascript files. You could use notepad, but there are better options. Here are a few others:

<ul>
<li><a href="http://brackets.io">Brackets</a></li>
<li><a href="https://sublimetext.com">Sublime</a></li>
<li><a href="https://notepad-plus-plus.org">Notepad++</a></li>
<li><a href="https://code.visualstudio.com/">Visual Studio Code</a></li>

<u>More Tools</u>
<li><a href="https://www.lucidchart.com/">LucidChart.com</a></li>
<li><a href="http://www.bootply.com/">Bootstrap playground</a></li>http://www.bootply.com/
<li><a href="https://pixlr.com/">pixlr online photoshop</a></li>
<li><a href="https://moqups.com/">Moqups.com</a></li>


</ul>

Some IDEs offer nodejs development environments. I was able to set one up with eclipse. They can make the development process easier, especially if you're comfortable with it.

## Get Coding!

I recommend going through this [tutorial](https://www.youtube.com/watch?v=kHV7gOHvNdk) if you are unfamiliar with this setup.


[![Join the chat at https://gitter.im/Hotel-Reservation-Project/Lobby](https://badges.gitter.im/Hotel-Reservation-Project/Lobby.svg)](https://gitter.im/Hotel-Reservation-Project/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
