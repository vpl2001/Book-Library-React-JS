import $ from 'jquery';

let KinveyRequester = (function () {
    const baseUrl = 'https://baas.kinvey.com/';
    const app_id = 'kid_rJlEpE4Mg';
    const app_secret = '6ccbaa60a4214a9db6d4e7d7f05f9b1c';
    const authHeaders = {
        Authorization: "Basic "+ btoa(app_id +":" + app_secret)
    };
    
    function loginUser (username, password) {
        return $.ajax({
            method: 'POST',
            url: baseUrl + "user/" + app_id + "/login",
            data: {username, password},
            headers: authHeaders
        });
    }

    function registerUser (username, password) {
        return $.ajax({
            method: 'POST',
            url: baseUrl + "user/" + app_id,
            data: {username, password},
            headers:authHeaders
        });
    }
    function loadBooks () {
        return $.ajax({
            method: 'GET',
            url: baseUrl + "appdata/" + app_id + '/books',
            headers:getUserAuthHeaders()
        });
    }

    function getUserAuthHeaders () {
        return {
            Authorization: "Kinvey " + sessionStorage.getItem('authToken')
        }
    }

    return {
        loginUser,
        registerUser,
        loadBooks
    }

})();

export default KinveyRequester;

