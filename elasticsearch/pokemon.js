var elasticsearch = require('elasticsearch');
var fs = require('fs');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  //log: 'trace'
});

/**
 * Index all the pokemons from pokemon.file into elasticsearch
 */
fs.readFile('pokemon.json', 'utf8', function(err, contents) {
    if (err) console.error("Unable to read file " + err); 
    var json = JSON.parse(contents);
    
    var indexes = []
    
    for(var i=0; i < json.length; i++){
        indexes.push( { index:  { _index: 'pokemon', _type: 'pokemon', _id: i+1 } });
        var pokemon = json[i]; 
        delete pokemon._id;
        indexes.push(pokemon);
    }
    console.log("Indexing "+(indexes.length/2)+ " pokemons on elasticsearch");
    
    client.bulk({
        body: indexes
    }, function (err, resp) {
        if (err) console.error("Unable to add to elasticsearch " + err); 
        else console.log("Indexed pokemons on elasticsearch"); 
      });
    
  });

  /**
   * Method to search by name, description or type in ElasticSearch
   * @param {*} name 
   */
var search = (q) => {
    
   return  client.search({ 
    index: 'pokemon',
    body: {
      query: {
        "query_string": {
            fields : ["name^3", "description", "types^2"],
            query : "*" + q+ "*"
        } 
      }
    }
  });
}

module.exports = {
      'search': search
} ; 
