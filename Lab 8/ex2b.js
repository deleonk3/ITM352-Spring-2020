var age= 24;
var count = 0;
while(count++ < age) {
    if((count > age/2) && (count < age*(3/4))){
        console.log("No age zone!");
        continue;
    }
    console.log(count);
}
