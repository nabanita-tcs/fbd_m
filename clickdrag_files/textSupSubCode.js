var TextSuperSubScript=TextSuperSubScript || {};
TextSuperSubScript= function (){
	/**
	 * function name: getCharecterFromSubscript()
	 * author:Piyali Saha
	 */
	this.getCharecterFromSubscript=function(){
		console.log("@TextSuperSubScript.getCharecterFromSubscript");
		
		var charFromSubscript=new Array();
		/*0-9*/
		charFromSubscript["₀"]= "0";
		charFromSubscript["₁"]= "1";
		charFromSubscript["₂"]= "2";
		charFromSubscript["₃"]= "3";
		charFromSubscript["₄"]= "4";
		charFromSubscript["₅"]= "5";
		charFromSubscript["₆"]= "6";
		charFromSubscript["₇"]= "7";
		charFromSubscript["₈"]= "8";
		charFromSubscript["₉"]= "9";
		/*+,-,=()*/
		charFromSubscript["₊"]= "+";
		charFromSubscript["₋"]= "-";
		charFromSubscript["₌"]= "=";
		charFromSubscript["₍"]= "(";
		charFromSubscript["₎"]= ")";
		
		/*a-z*/
		charFromSubscript["ₐ"]= "a";
		//charFromSubscript[]="b";
		//charFromSubscript[]="c";
		//charFromSubscript[]="d";
		charFromSubscript["ₑ"]= "e";
		//charFromSubscript[]= "f";
		//charFromSubscript[]= "g";
		//charFromSubscript[]= "h";
		//charFromSubscript[]= "i";
		//charFromSubscript[]= "j";
		//charFromSubscript[]= "k";
		//charFromSubscript[]= "l";
		//charFromSubscript[]= "m";
		//charFromSubscript[]= "n";
		charFromSubscript["ₒ"]= "o";
		//charFromSubscript[]="p" ;
		//charFromSubscript[]= "q";
		//charFromSubscript[]="r" ;
		//charFromSubscript[]="s" ;
		//charFromSubscript[]= "t";
		//charFromSubscript[]="u" ;
		//charFromSubscript[]="v" ;
		//charFromSubscript[]="w";
		charFromSubscript["ₓ"]= "x";
		//charFromSubscript[]="y" ;
		//charFromSubscript[]="z" ;
		
		
		 
	 return charFromSubscript;	
			
	}
	/**
	 * function name: getSubscriptCharecter()
	 * author:Piyali Saha
	 */
	this.getSubscriptCharecterList=function(){
		console.log("@TextSuperSubScript.getSubscriptCharecterList");
		var subsCriptCharecter=new Array();
		/*0-9*/
		subsCriptCharecter["0"]= "\u2080";
		subsCriptCharecter["1"]= "\u2081";
		subsCriptCharecter["2"]= "\u2082";
		subsCriptCharecter["3"]= "\u2083";
		subsCriptCharecter["4"]= "\u2084";
		subsCriptCharecter["5"]= "\u2085";
		subsCriptCharecter["6"]= "\u2086";
		subsCriptCharecter["7"]= "\u2087";
		subsCriptCharecter["8"]= "\u2088";
		subsCriptCharecter["9"]= "\u2089";
		/*+,-,=()*/
		subsCriptCharecter["+"]= "\u208A";
		subsCriptCharecter["-"]= "\u208B";
		subsCriptCharecter["="]= "\u208C";
		subsCriptCharecter["("]= "\u208D";
		subsCriptCharecter[")"]= "\u208E";
		
		/*a-z*/
		subsCriptCharecter["a"]= "\u2090";
		//subsCriptCharecter["b"]= ;
		//subsCriptCharecter["c"]= ;
		//subsCriptCharecter["d"]= ;
		subsCriptCharecter["e"]= "\u2091";
		//subsCriptCharecter["f"]= ;
		//subsCriptCharecter["g"]= ;
		//subsCriptCharecter["h"]= ;
		//subsCriptCharecter["i"]= ;
		//subsCriptCharecter["j"]= ;
		//subsCriptCharecter["k"]= ;
		//subsCriptCharecter["l"]= ;
		//subsCriptCharecter["m"]= ;
		//subsCriptCharecter["n"]= ;
		subsCriptCharecter["o"]= "\u2092";
		//subsCriptCharecter["p"]= ;
		//subsCriptCharecter["q"]= ;
		//subsCriptCharecter["r"]= ;
		//subsCriptCharecter["s"]= ;
		//subsCriptCharecter["t"]= ;
		//subsCriptCharecter["u"]= ;
		//subsCriptCharecter["v"]= ;
		//subsCriptCharecter["w"]= ;
		subsCriptCharecter["x"]= "\u2093";
		//subsCriptCharecter["y"]= ;
		//subsCriptCharecter["z"]= ;
		
		
		 
	 return subsCriptCharecter;	
		                
	};
	
	/**
	 * function name: getCharecterFromSuperscript()
	 * author:Piyali Saha
	 */
	this.getCharecterFromSuperscript=function(){
		console.log("@TextSuperSubScript.getCharecterFromSuperscript");
		var charFromSuperscript=new Array();
		/*0-9*/
		charFromSuperscript["⁰"]= "0";
		charFromSuperscript["¹"]= "1";
		charFromSuperscript["²"]= "2";
		charFromSuperscript["³"]= "3";
		charFromSuperscript["⁴"]= "4";
		charFromSuperscript["⁵"]= "5";
		charFromSuperscript["⁶"]= "6";
		charFromSuperscript["⁷"]= "7";
		charFromSuperscript["⁸"]= "8";
		charFromSuperscript["⁹"]= "9";
		/*+,-,=()<>.^*/
		charFromSuperscript["⁺"]= "+";
		charFromSuperscript["⁻"]= "-";
		charFromSuperscript["⁼"]= "=";
		charFromSuperscript["⁽"]= "(";
		charFromSuperscript["⁾"]= ")";
		charFromSuperscript["˂"]= "<";
		charFromSuperscript["˃"]= ">";
		charFromSuperscript["˄"]= "^";
		charFromSuperscript["˙"]= ".";
		
		/*a-z*/
		charFromSuperscript["ᵃ"]= "a";
		charFromSuperscript["ᵇ"]= "b";
		charFromSuperscript["˓"]= "c";
		charFromSuperscript["ᵈ"]="d" ;
		charFromSuperscript["ᵉ"]= "e";
		//charFromSuperscript[]="f" ;
		//charFromSuperscript[]="g" ;
		charFromSuperscript["ʰ"]= "h";
		charFromSuperscript["ˈ"]= "i";
		charFromSuperscript["ʲ"]= "j";
		charFromSuperscript["ᴷ"]= "k";
		charFromSuperscript["ˡ"]= "l";
		charFromSuperscript["ᵐ"]= "m";
		charFromSuperscript["ⁿ"]= "n";
		charFromSuperscript["ᵒ"]= "o";
		charFromSuperscript["ᵖ"]= "p";
		//charFromSuperscript[]="q" ;
		charFromSuperscript["ʳ"]= "r";
		charFromSuperscript["ˢ"]= "s";
		charFromSuperscript["ᵗ"]= "t";
		charFromSuperscript["ᵘ"]= "u";
		charFromSuperscript["˅"]= "v";
		charFromSuperscript["ʷ"]="w" ;
		//charFromSuperscript[]="x" ;
		charFromSuperscript["ʸ"]= "y";
		//charFromSuperscript[]="z" ;
				 
	 return charFromSuperscript;	
		                
	};
	
	
	/**
	 * function name: getSubscriptCharecter()
	 * author:Piyali Saha
	 */
	this.getSuperscriptCharecter=function(){
		console.log("@TextSuperSubScript.getSubscriptCharecter");
		var supsCriptCharecter=new Array();
		/*0-9*/
		supsCriptCharecter["0"]= "\u2070";
		supsCriptCharecter["1"]= "\u00B9";
		supsCriptCharecter["2"]= "\u00B2";
		supsCriptCharecter["3"]= "\u00B3";
		supsCriptCharecter["4"]= "\u2074";
		supsCriptCharecter["5"]= "\u2075";
		supsCriptCharecter["6"]= "\u2076";
		supsCriptCharecter["7"]= "\u2077";
		supsCriptCharecter["8"]= "\u2078";
		supsCriptCharecter["9"]= "\u2079";
		/*+,-,=()<>.^*/
		supsCriptCharecter["+"]= "\u207A";
		supsCriptCharecter["-"]= "\u207B";
		supsCriptCharecter["="]= "\u207C";
		supsCriptCharecter["("]= "\u207D";
		supsCriptCharecter[")"]= "\u207E";
		supsCriptCharecter["<"]= "\u02C2";
		supsCriptCharecter[">"]= "\u02C3";
		supsCriptCharecter["^"]= "\u02C4";
		supsCriptCharecter["."]= "\u02D9";
		
		/*a-z*/
		supsCriptCharecter["a"]= "\u1D43";
		supsCriptCharecter["b"]= "\u1D47";
		supsCriptCharecter["c"]= "\u02D3";
		supsCriptCharecter["d"]="\u1D48" ;
		supsCriptCharecter["e"]= "\u1D49";
		//supsCriptCharecter["f"]= ;
		//supsCriptCharecter["g"]= ;
		supsCriptCharecter["h"]= "\u02B0";
		supsCriptCharecter["i"]= "\u02C8";
		supsCriptCharecter["j"]= "\u02B2";
		supsCriptCharecter["k"]= "\u1D37";
		supsCriptCharecter["l"]= "\u02E1";
		supsCriptCharecter["m"]= "\u1D50";
		supsCriptCharecter["n"]= "\u207F";
		supsCriptCharecter["o"]= "\u1D52";
		supsCriptCharecter["p"]= "\u1D56";
		//supsCriptCharecter["q"]= ;
		supsCriptCharecter["r"]= "\u02B3";
		supsCriptCharecter["s"]= "\u02E2";
		supsCriptCharecter["t"]= "\u1D57";
		supsCriptCharecter["u"]= "\u1D58";
		supsCriptCharecter["v"]= "\u02C5";
		supsCriptCharecter["w"]="\u02B7" ;
		//supsCriptCharecter["x"]= ;
		supsCriptCharecter["y"]= "\u02B8";
		//supsCriptCharecter["z"]= ;
				 
	 return supsCriptCharecter;	
		                
	};
		
};