const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoCool").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="cool">Coolness: </label>
            <input id="domoCool" type="text" name="cool" placeholder="Domo Coolness"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const handleDelete = (e) => {
    e.preventDefault();

    //sendAjax('POST', $("#deleteForm").attr("action"), $("#deleteForm").serialize());

    return false;
}

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name}</h3>
                <h3 className="domoAge"> Age: {domo.age}</h3>
                <h3 className="domoCool">Coolness: {domo.cool}</h3>
                <form id="deleteForm"
                    onSubmit={handleDelete}
                    name="deleteForm"
                    action="/delete"
                    method="POST"
                    className="deleteForm"
                >
                    <input type="hidden" name="name" value={domo.name} readOnly/>
                    <input type="hidden" name="age" value={domo.age} readOnly/>
                    <input type="hidden" name="cool" value={domo.cool} readOnly/>
                    <input className="deleteButton" type="submit" value="X" />
                </form>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});