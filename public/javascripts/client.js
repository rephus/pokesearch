
const url = 'http://localhost:3000/pokemon/search?q=';
$('input').keyup(function() {
  let q = $(this).val(); 
  $.getJSON(url + q, function(result){
    console.log("Got " + result.length + " pokemons"); 
    var $pokemons = $("<table></table>");
    for (var i = 0; i<result.length; i++){
      var attrs = result[i]._source; 

      $pokemons.append("<tr title='"+attrs.description+"'> " + 
        "<td>#" + attrs.pkdx_id+ "</td>"+
        "<td><img src='"+ attrs.art_url+ "'></td>"+
        "<td>" + attrs.name+ "</td>"+
        "<td>" + attrs.types+ "</td>"+        
        "</tr>");
    }
    $('#list').html($pokemons); 
  });
});