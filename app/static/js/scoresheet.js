var player_dict = {}
var game_id = undefined
var score_dict = {}


var sheet_rows = [
  "player",
  "military",
  "coin",
  "wonder",
  "civilian",
  "scientific",
  "commercial",
  "guild",
  "total"
]

function resetScores(){
  var table=$('#score-table')
  table.innerHTML = "" 
  // while (child) {
  //     console.log("Remooving children")
  //     table.removeChild(child); 
  //     child = table.childNodes[0]; 
  // }
  render_sheet()
  M.toast({html: 'Board reset'})
}

function updateGameId(){
  document.getElementById("game-id").innerHTML = game_id
}

function newGame(){
  $.ajax({
    method: 'POST',
    url: '/create_game',
    data: "",
    success: function(data){
        console.log('Creation Success');
        M.toast({html: 'Game created'})
        game_id = $.cookie("game_id")
        console.log(game_id)
        updateGameId()
        resetScores()
    }
  });
}


function saveGame(){
  $.ajax({
    method: 'POST',
    url: '/save_game',
    data: "",
    success: function(data){
        console.log('Game saved');
        M.toast({html: 'Game saved'})
    }
  });
}


function updateGame(){
  data = score_dict
  score_dict["game_id"] = parseInt(game_id)

  data = JSON.stringify(data)
  $.ajax({
    method: 'POST',
    url: '/update_game',
    data: data,
    success: function(data){
        console.log('Update Success');
        // M.toast({html: 'Update Successful'})
    }
  });
}


function computeTotals(){
  for(var player_name in player_dict){
    var total_score = 0;
    score_dict[player_name] = {}

    for(var row_idx in sheet_rows){
      var row_name = sheet_rows[row_idx]
      row_idx = parseInt(row_idx)
      if(row_idx>0 && row_idx<sheet_rows.length-1){
        var input_id = row_name+"-"+player_name
  
        var val = parseInt(document.getElementById(input_id).value)
  
        if(val==undefined || isNaN(val)){
          console.warn("no value found for ", input_id)
          val = 0
          // return;
        } else {
          console.log("Adding value: ",val)
          total_score += val
        }
  
        score_dict[player_name][row_name] = val

      }
    }
    console.log("computed total score for ", player_name, total_score)
    score_dict[player_name]["total"] = total_score
    var result_text = document.createTextNode(total_score.toString())
    var score_box = document.getElementById(player_name+"-total-col")

    if(score_box.hasChildNodes()){
      score_box.removeChild(score_box.childNodes[0])
    }
    score_box.appendChild(result_text)
  }
  console.log(score_dict)
  // M.toast({html: 'Totals Computed'})
  updateGame()
}


function render_sheet(){
  console.log('rendering sheet')
  var table=$('#score-table')

  if(table!=undefined){
    table.remove()
  }

  table = document.createElement("table")
  table.id = "score-table"

  // for(var i=0; i<table.childNodes.length; i++){
  //   table.childNodes[i].removeChild(table.childNodes[i])
  // }

  for(var row_idx in sheet_rows){
    var row_name = sheet_rows[row_idx]
    try{
      var next_row_name = sheet_rows[parseInt(row_idx)+1]
      console.log("next row: ", next_row_name)
      console.log("row name: ", row_name)
      console.log("row idx: ", row_idx)
    } catch(err){
      ;
    }
    
    var table_row = document.createElement("tr")
    table_row.classList.add(row_name)

    var table_col = document.createElement("td")

    if(row_name == "scientific" || row_name == "civilian"){
      table_col.classList.add("white-input")
    }

    var col_text = document.createTextNode(row_name);

    table_col.appendChild(col_text)
    table_row.appendChild(table_col)

    for(var player_name in player_dict){
      var player_idx = player_dict[player_name]

      console.log("player name: ", player_name)
      console.log("player idx: ", player_idx)

      if(row_name == "player"){
        table_col = document.createElement("td")
        table_col.id = player_name+"-"+sheet_rows[row_idx]+"-col"
        
        col_text = document.createTextNode(player_name)
        table_col.appendChild(col_text)
      } else if (row_name == "total"){
        table_col = document.createElement("td")
        table_col.id = player_name+"-"+sheet_rows[row_idx]+"-col"
      }else{
        table_col = document.createElement("td")
        table_col.id = player_name+"-"+sheet_rows[row_idx]+"-col"

        // Input element
        input_div = document.createElement("div")
        input_div.classList.add("input-field")
        input_div.classList.add("col")
        input_div.classList.add("s12")
        
        var input_id = row_name+"-"+player_name
        input_element = document.createElement("input")
        input_element.id = input_id
        input_element.type = "number"

        // Add change event
        // if(parseInt(row_idx)+1 < 7){
        //   console.log("adding event listener id: "+input_id+", focus: "+next_row_name+"-"+player_name)
        //   input_element.addEventListener("change", function(){ document.getElementById(next_row_name+"-"+player_name).focus() })
        // }
        
        // label
        label_element = document.createElement("label")
        // label_element.classList.add('black-input')
        label_element.setAttribute("for", "wonder-input")
        var label_text = document.createTextNode(row_name+" ("+player_name+")")
        label_element.appendChild(label_text)

        if(row_name == "scientific" || row_name == "civilian"){
          label_element.classList.add("white-input")
          input_element.classList.add("white-input")
        } else {
          label_element.classList.add("black-input")
        }

        input_div.appendChild(input_element)
        input_div.appendChild(label_element)

        table_col.appendChild(input_div)
      }

      table_row.appendChild(table_col)
    }
    table.appendChild(table_row)
  }

  document.getElementById("table-container").appendChild(table)

  for(var row_idx in sheet_rows){
    var row_name = sheet_rows[row_idx]
    for(var player_name in player_dict){
      (function(){
        if(parseInt(row_idx)+1 <= 8){
          var input_id = row_name+"-"+player_name
          var next_row_name = sheet_rows[parseInt(row_idx)+1]
          var next_input_id = next_row_name+"-"+player_name
          console.log("adding event listener id: "+input_id+", focus: "+next_input_id)
          try{
            document.getElementById(input_id).addEventListener("change", function(){ 
              console.log("changing to "+next_input_id);

              try{
                document.getElementById(next_input_id).focus()
              } catch(err){
                ;
              }
              computeTotals()
            });
  
          } catch(err) {
            console.warn(input_id+" not found");
          }
        }
      }());
    }
  }
}


// console.log('content loaded')
document.addEventListener('DOMContentLoaded', function() {
    // $('.sidenav').sidenav();
    console.log('content loaded')

    // Initialize sidenav
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    player_dict_cookie = $.cookie("player_dict")

    if(player_dict_cookie == undefined){
      M.toast({html: 'No players present. Add players and try again'})
      return
    }

    player_dict_cookie = player_dict_cookie.replace(/\\054/g, ",")
    player_dict = JSON.parse(player_dict_cookie)

    console.log(player_dict)
    render_sheet();
    newGame();
    // updateGameId();
  });