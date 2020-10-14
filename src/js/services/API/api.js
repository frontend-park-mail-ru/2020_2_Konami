'use strict';

function postUser(editFields) {
    return fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify(editFields),
    }).then(
        (response) => {
            return {
                statusCode: response.status,
            };
    }).catch(
    (error) => {
        return {
            error: error
        };
    });
}

function getUser(userId) {
    let statusCode;
    return fetch(`/user?userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        statusCode = response.status;
        return response.json();
    }).then(parsedJson => {
        return {
            statusCode,
            parsedJson,
        };
    });
}

function getMeetings(pageNum) {
    let statusCode;
    return fetch(`/meetings?pageNum=${pageNum}`, {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        console.log(response.status);
        statusCode = response.status;
        return response.json();
    }).then(parsedJson => {
        return {
            statusCode,
            parsedJson,
        };
    });
}

function getPeople(pageNum) {
    let statusCode;
    return fetch(`/people?pageNum=${pageNum}`, {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        statusCode = response.status;
        return response.json();
    }).then(parsedJson => {
        return {
            statusCode,
            parsedJson,
        };
    });
}

function postPhoto(data) {
    return fetch('/images', {
        method: 'POST',
        credentials: 'include',
        body: data,
    }).then(response => {
        return response.status;
    });
}

const postLogin = async (login, password) => {
    return fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then(
        (response) => {
            return {
                statusCode: response.status,
            };
    }).catch(
        (error) => {
            return {
                error: error
            };
        });
}

function getMe() {
    return fetch('/me', {
        method: 'GET',
        credentials: 'include'
    }).then(response => {
        return response.json();
    }).then(parsedJson => {
        return parsedJson.userId;
    });

}

function postSignUp(login, password) {
    return fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then(
        (response) => {
            return {
                statusCode: response.status,
            };
    }).catch(
        (error) => {
            console.log(error);
            return {
                error: error
            };
        });
}

function postSignOut() {
    return fetch('/logout', {
        method: 'POST',
        credentials: 'include',
    }).then(response => {
        return response.status;
    });
}

export {
    postUser,
    getPeople,
    getUser,
    getMeetings,
    postPhoto,
    postLogin,
    getMe,
    postSignUp,
    postSignOut,
};
