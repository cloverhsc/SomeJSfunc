// ch7 page 153.
var data=[1,2,3,4,5];
var sum =0;

data.forEach(function(v, i , a){a[i]= v+1;});
data;

//
function foreach(a,f,t){
    try{ a.forEach(f,t);}
    catch(e){
        if(e === foreach.break) return;
        else throw e;
    }
}

foreach.break = new Error("StopIteration");


//-----------

Array.join = Array.join || function(a,sep){
    return Array.prototype.join.call(a,sep);
};
