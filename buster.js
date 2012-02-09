var config = module.exports;

config["My tests"] = {
  environment: "node",
     sources: [
         "./src/services/*.js"    
     ],
     tests: [
       "./src/services/test/*.js"
     ]
}
