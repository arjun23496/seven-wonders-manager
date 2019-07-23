var player_dict;
var player_idx;

// <button class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">delete</i></button>
function createDeleteButton(){
    var icon = document.createElement("i")
    icon.classList.add("material-icons")
    icon.appendChild(document.createTextNode("delete"))

    var button = document.createElement("button")
    button.classList.add("btn-floating")
    button.classList.add("waves-effect")
    button.classList.add("waves-light")
    button.classList.add("red")

    button.appendChild(icon)

    return button
}


function checkBoxChange(handle){
    if( $(handle).is(':checked') ){
        console.log("Checked")
        addPlayer(handle.id)
    } else {
        console.log("Unchecked")
        removePlayer(handle.id)
    }
    renderRoster()
}


function renderRoster(){
    var table_container = document.getElementById("table-container")
    
    var table = document.getElementById("player-table")

    if(table != undefined){
        table.remove()
    }

    var table = document.createElement("table")
    table.id = "player-table"

    var table_row = document.createElement("tr")
    var table_col = document.createElement("td")
    var col_text = document.createTextNode("Idx")
    table_col.appendChild(col_text)
    table_row.appendChild(table_col)

    table_col = document.createElement("td")
    col_text = document.createTextNode("Name")
    table_col.appendChild(col_text)
    table_row.appendChild(table_col)

    table.appendChild(table_row)

    for(var player_name in player_dict){
        player_idx = player_dict[player_name]
        
        table_row = document.createElement("tr")
        table_col = document.createElement("td")
        col_text = document.createTextNode(player_idx.toString())
        table_col.appendChild(col_text)
        table_row.appendChild(table_col)

        table_col = document.createElement("td")
        col_text = document.createTextNode(player_name)
        table_col.appendChild(col_text)
        table_row.appendChild(table_col)

        table_col = document.createElement("td")

        var button = createDeleteButton()
        button.id = "delete-"+player_name

        button.addEventListener("click", function(){
            var player_name = this.id.split("-")[1]
            console.log("Removing ", player_name)
            removePlayer(player_name)
        })
    
        table_col.appendChild(button)
        table_row.appendChild(table_col)

        table.appendChild(table_row)
    }

    table_container.appendChild(table)
}


function continuePage(){
    console.log("Continue page");

    // var data = player_dict
    var data = JSON.stringify(player_dict)
    console.log(data)
    $.ajax({
        method: 'POST',
        url: '/score_sheet',
        data: data,
        success: function(data){
            console.log('Success');
            M.toast({html: 'Player roster updated'});
            // window.location.href = '/score_sheet'
        }
      });
}


function removePlayer(player_name){
    console.log("trying to remove ", player_name)

    delete player_dict[player_name]

    var checkbox = document.getElementById(player_name)
    if(checkbox != undefined){
        checkbox.checked = false
    }

    renderRoster()
}


function addPlayer(player_name){
    console.log("Trying to add: "+player_name);

    if(player_name == undefined || player_name ==""){
        console.warn("Player name empty");
        M.toast({html: 'Player name empty'})
    } else {
        if(player_name in player_dict){
            console.warn("Player name already exist")
        } else {
            console.log("not in dictionary. Adding player...")
            player_idx += 1
            player_dict[player_name] = player_idx

            console.log(player_dict)
        }

        renderRoster()
    }
}


function addPlayerWrapper(){
    var player_name = $('#player-input').val();
    addPlayer(player_name)
    document.getElementById("player-input").value = ""
}


$(document).ready(function(){
    // $('.sidenav').sidenav();
    player_dict = {}
    player_idx = 0

    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    var player_dict_cookie = $.cookie("player_dict")

    if(player_dict_cookie != undefined){
        player_dict_cookie = player_dict_cookie.replace(/\\054/g, ",")
        player_dict = JSON.parse(player_dict_cookie)

        for(var player_name in player_dict){
            var checkbox = document.getElementById(player_name)
            if(checkbox != undefined){
                checkbox.checked = true
            }
        }
    }

    renderRoster()
});