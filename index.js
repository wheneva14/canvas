const data = {
	a : 1,
	c : 3,
};


(({a = 3 , b = 10} =  data  )=>{ console.log(a); })(data, {b:3});
(({a = 3 , b = 10} =  data  )=>{ console.log(a); })({b:3}, data);
(({a = 3 , b = 10} =  data  )=>{ console.log(a); })({a:7});