import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './App.css';

import Footer from './Components/Footer';
import NavigationBar from './Components/NavigationBar';

import HomeView from './Views/HomeView';
import LoginView from './Views/LoginView';
import RegisterView from './Views/RegisterView';
import ShowBooksView from './Views/ShowBooksView';
import CreateBookView from './Views/CreateBookView';
import KinveyRequester from './KinveyRequester';
import $ from 'jquery';



export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: sessionStorage.getItem("username"),
            userId: sessionStorage.getItem("userId")
        };
   }
    render() {
        return (
            <div className="App">
                <header>
                    <NavigationBar
                        username={this.state.username}
                        homeClicked={this.showHomeView.bind(this)}
                        loginClicked={this.showLoginView.bind(this)}
                        registerClicked={this.showRegisterView.bind(this)}
                        booksClicked={this.showBooksView.bind(this)}
                        createBookClicked={this.showCreateBookView.bind(this)}
                        logoutClicked={this.logout.bind(this)}
                    />

                    <div id="loadingBox">Loading...</div>
                    <div id="infoBox">Info...</div>
                    <div id="errorBox">Error</div>

                </header>

                <div id="main">Main App Body</div>

                <Footer/>
            </div>
        );
    }

    componentDidMount() {
        // Attach global AJAX "loading" event handlers
        $(document).on({
            ajaxStart: function () {
                $("#loadingBox").show()
            },
            ajaxStop: function () {
                $("#loadingBox").hide()
            }
        });

        // Attach a global AJAX error handler
        $(document).ajaxError(
            this.handleAjaxError.bind(this));
        this.showView(<HomeView />);

        $('#errorBox').click(function () {
           $('#errorBox').hide()
        });
        $('#infoBox').click(function () {
            $('#infoBox').hide()
        });
    }

    handleAjaxError(event, response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        this.showError(errorMsg);
    }

    showInfo(message) {
        $('#infoBox').text(message).show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg).show();
    }


    showView (reactComponent){
    ReactDOM.render(
        reactComponent,
        document.getElementById('main')
    );
    }


    showHomeView(){
        this.showView(<HomeView />);
    }

    showLoginView(){
        this.showView(<LoginView onsubmit={this.login.bind(this)}/>);
    }

    login (username, password){

       KinveyRequester.loginUser(username, password).then(loginSuccess.bind(this));

       function loginSuccess(userInfo) {
           this.saveAuthInSession(userInfo);
          this.showInfo("Login successful!");
          this.showBooksView();
       }
    }


    showRegisterView(){
        this.showView(<RegisterView onsubmit={this.register.bind(this)}/>);
    }


    register(username, password){
        KinveyRequester.registerUser(username, password).then(registerSuccess.bind(this));

        function registerSuccess(userInfo) {
            this.saveAuthInSession(userInfo);
            this.showInfo("Registration  successful!");
            this.showBooksView();
        }
    }

    saveAuthInSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', userInfo.username);

        // This will update the entire app UI (e.g. the navigation bar)
        this.setState({
            username: userInfo.username,
            userId: userInfo._id
        });
    }

    showBooksView (){
        KinveyRequester.loadBooks().then(loadBooksSuccess.bind(this));
        function loadBooksSuccess (books) {
            this.showInfo("Books loaded");
            this.showView(<ShowBooksView books={books}/>);
        }
    }

    showCreateBookView (){
        this.showView(<CreateBookView />);
    }

    logout (){
       sessionStorage.clear();
        this.setState({
            username: null,
            userId: null
        });
        this.showHomeView();
    }

}

