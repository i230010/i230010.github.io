'use strict';
const rad=Math.PI/180;

const maxiterations=40;
    
function solveQuadrant(sin,cos){
    if(sin>=0 && cos>=0){return Math.asin(sin);}
    if(sin<0 && cos>=0){return Math.asin(sin);}
    if(sin<0 && cos<0){return -Math.acos(cos);}
    if(sin>=0 && cos<0){return Math.acos(cos);}
}

export function getElementsQueried(){
    const elements={};
    const urlParams = new URLSearchParams(window.location.search);
    elements.Δt = parseFloat(urlParams.get('dT'));
    elements.T0 = parseFloat(urlParams.get('T0'));

    elements.X0 = parseFloat(urlParams.get('X0'));
    elements.X1 = parseFloat(urlParams.get('X1'));
    elements.X2 = parseFloat(urlParams.get('X2'));
    elements.X3 = parseFloat(urlParams.get('X3'));
    
    elements.Y0 = parseFloat(urlParams.get('Y0'));
    elements.Y1 = parseFloat(urlParams.get('Y1'));
    elements.Y2 = parseFloat(urlParams.get('Y2'));
    elements.Y3 = parseFloat(urlParams.get('Y3'));

    elements.d0 = parseFloat(urlParams.get('D0'));
    elements.d1 = parseFloat(urlParams.get('D1'));
    elements.d2 = parseFloat(urlParams.get('D2'));
    elements.d3 = parseFloat(urlParams.get('D3'));

    elements.M0 = parseFloat(urlParams.get('M0'));
    elements.M1 = parseFloat(urlParams.get('M1'));
    elements.M2 = parseFloat(urlParams.get('M2'));
    elements.M3 = parseFloat(urlParams.get('M3'));

    elements.L10 = parseFloat(urlParams.get('L10'));
    elements.L11 = parseFloat(urlParams.get('L11'));
    elements.L12 = parseFloat(urlParams.get('L12'));
    elements.L13 = parseFloat(urlParams.get('L13'));

    elements.L20 = parseFloat(urlParams.get('L20'));
    elements.L21 = parseFloat(urlParams.get('L21'));
    elements.L22 = parseFloat(urlParams.get('L22'));
    elements.L23 = parseFloat(urlParams.get('L23'));

    elements.tanf1 = parseFloat(urlParams.get('tanf1'));
    elements.tanf2 = parseFloat(urlParams.get('tanf2'));

    const values = Object.values(elements);
    const hasInvalid = values.some(val => val === null || Number.isNaN(val));
    if(hasInvalid){
        return getElements2024();
    } else {
        return elements;
    }
}

export function getElements(){
    return getElementsQueried();
}

export function getElements2024(){
    // Besselian elements for April 8, 2024 Total Solar Eclipse
    const elements={};
    elements.Δt=69;  // ΔT in seconds (approximate)
    elements.T0=18;   // Reference time in TDT (hours)

    elements.X0=-0.318157;
    elements.X1=0.5117105;
    elements.X2=0.0000326;
    elements.X3=-0.0000085;

    elements.Y0=0.219747;
    elements.Y1=0.2709586;
    elements.Y2=-0.0000594;
    elements.Y3=-0.0000047;

    elements.d0=7.58620;
    elements.d1=0.014844;
    elements.d2=-0.000002;
    elements.d3=0;  // missing value replaced with 0

    elements.M0=89.59122;
    elements.M1=15.004084;
    elements.M2=0;  // missing value replaced with 0
    elements.M3=0;  // missing value replaced with 0

    elements.L10=0.535813;
    elements.L11=0.0000618;
    elements.L12=-0.0000128;

    elements.L20=-0.010274;
    elements.L21=0.0000615;
    elements.L22=-0.0000127;

    elements.tanf1=0.0046683;
    elements.tanf2=0.0046450;

    return elements;
}

function getFundamentalArguments(e,t,Φ,λ,height){
    const o={};
    o.X=e.X0 + e.X1*t + e.X2*t*t + e.X3*t*t*t;
    o.Y=e.Y0 + e.Y1*t + e.Y2*t*t + e.Y3*t*t*t;
    o.d=e.d0 + e.d1*t + e.d2*t*t;
    o.M=e.M0 + e.M1*t;
    o.Xp=e.X1 + 2*e.X2*t + 3*e.X3*t*t;
    o.Yp=e.Y1 + 2*e.Y2*t + 3*e.Y3*t*t;
    o.L1=e.L10 + e.L11*t + e.L12*t*t;
    o.L2=e.L20 + e.L21*t + e.L22*t*t;

    o.H = o.M - λ - 0.00417807 * e.Δt;

    o.u1 = Math.atan(0.99664719*Math.tan(Φ*rad))/rad;
    o.ρsinΦp=0.99664719 * Math.sin(o.u1*rad)+height/6378140*Math.sin(Φ*rad);
    o.ρcosΦp=Math.cos(o.u1*rad) + height/6378140 * Math.cos(Φ*rad);

    o.ξ = o.ρcosΦp * Math.sin(o.H*rad);
    o.η = o.ρsinΦp * Math.cos(o.d*rad) - o.ρcosΦp * Math.cos(o.H*rad) * Math.sin(o.d*rad);
    o.ζ = o.ρsinΦp * Math.sin(o.d*rad) + o.ρcosΦp * Math.cos(o.H*rad) * Math.cos(o.d*rad);
    o.ξp = 0.01745329 * e.M1 * o.ρcosΦp * Math.cos(o.H*rad);
    o.ηp = 0.01745329 * (e.M1 * o.ξ * Math.sin(o.d*rad) - o.ζ * e.d1);
    o.L1p = o.L1 - o.ζ * e.tanf1;
    o.L2p = o.L2 - o.ζ * e.tanf2;

    o.u = o.X - o.ξ;
    o.v = o.Y - o.η;
    o.a = o.Xp - o.ξp;
    o.b = o.Yp - o.ηp;
    o.n = Math.sqrt(o.a*o.a + o.b*o.b);

    return o;

}

export function getLocalCircumstances(Φ,λ,height){
    const e=getElements();

    let t=0;
    let τm=10000;

    let iterations=0;
    let o;
    while(Math.abs(τm)>.00001 && iterations<maxiterations){
        o=getFundamentalArguments(e,t,Φ,λ,height);
        τm = - (o.u*o.a + o.v*o.b)/(o.n*o.n);
        t = t + τm;
        iterations++;
    }

    const m = Math.sqrt(o.u*o.u + o.v*o.v);
    const G = (o.L1p - m)/(o.L1p + o.L2p);
    const A = (o.L1p - o.L2p)/(o.L1p + o.L2p);

    //const Pm = Math.atan2(-o.vp, o.up);
    const Pm = Math.atan2(o.u/o.v)/rad;

    const sinh=Math.sin(o.d*rad)*Math.sin(Φ*rad) + Math.cos(o.d*rad)*Math.cos(Φ*rad)*Math.cos(o.H*rad);
    const h=Math.asin(sinh)/rad;
    const q = Math.asin(Math.cos(Φ*rad) * Math.sin(o.H*rad) / Math.cos(h*rad));

    let S = (o.a*o.v - o.u*o.b)/(o.n * o.L1p);
    let τ = o.L1p/o.n * Math.sqrt(1 - S*S);

    let firstContact = t - τ;
    let lastContact = t + τ;

    for(let i=0; i<10; i++){
        const fco=getFundamentalArguments(e,firstContact,Φ,λ,height);

        S = (fco.a*fco.v - fco.u*fco.b)/(fco.n * fco.L1p);
        const τf = - (fco.u*fco.a + fco.v*fco.b)/(fco.n*fco.n) - fco.L1p/fco.n * Math.sqrt(1 - S*S);

        firstContact = firstContact + τf;
    }

    for(let i=0; i<10; i++){
        const fco=getFundamentalArguments(e,lastContact,Φ,λ,height);

        S = (fco.a*fco.v - fco.u*fco.b)/(fco.n * fco.L1p);
        const τf = - (fco.u*fco.a + fco.v*fco.b)/(fco.n*fco.n) + fco.L1p/fco.n * Math.sqrt(1 - S*S);

        lastContact = lastContact + τf;
    }

    const UTFirstContact=e.T0 + firstContact - e.Δt/60/60;
    const UTLastContact=e.T0 + lastContact - e.Δt/60/60;
    const UTMaximum = e.T0 + t  - e.Δt/60/60;

    // console.log("sinh",sinh);
    // console.log("h",h);
    // console.log("q",q);
    // console.log("S",S);
    // console.log("τ",τ);
    // console.log("firstContact",firstContact);
    // console.log("lastContact",lastContact);

    // console.log("t",t);
    const UT=e.T0 + t;
    // console.log("UT",UT);

    // console.log("First Contact UT", UTFirstContact);
    // console.log("UT Maximum",UTMaximum);
    // console.log("Last Contact UT", UTLastContact);
    // console.log("Magnitude", G);
    // console.log("Ratio Moon/Sun",A);

    return {t:t, UT: UT, mag: G, UTMaximum: UTMaximum, h:h, m:m, elements: o};
}