async function readLine(name, lineinput) {
    const lineNumber = lineinput;
    let output;
    try {
        // Fetch the file from the server
        const response = await fetch(name); // file should be in the same folder
        if (!response.ok) throw new Error('File not found');

        const text = await response.text();
        const lines = text.split(/\r?\n/); // split by line
        const line = lines[lineNumber - 1] || 'Line does not exist';
        output = line;
    } catch (err) {
        output = 'Error: ' + err.message;
    }
    return output;
}

async function main() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = parseInt(urlParams.get('ID'));
    if (isNaN(id) || id <= 0 || id >= 224) {
        id = 1;
    }
    let tex = await readLine('list.txt', id);
    let parsedArray = tex.split(',').map(item => {
        // Convert to number if it's a number, otherwise keep as string
        return isNaN(item) ? item : Number(item);
    });

    document.getElementById("UT1").innerHTML = "Solar Eclipse of " + String(parsedArray[0])
    document.getElementById("TT").innerHTML = String(parsedArray[1])
    document.getElementById("dT").innerHTML = "Delta T = " + String(parsedArray[2])
    document.getElementById("T0").innerHTML = "T0 = " + String(parsedArray[3])

    document.getElementById("X0").innerHTML = String(parsedArray[4])
    document.getElementById("X1").innerHTML = String(parsedArray[5])
    document.getElementById("X2").innerHTML = String(parsedArray[6])
    document.getElementById("X3").innerHTML = String(parsedArray[7])

    document.getElementById("Y0").innerHTML = String(parsedArray[8])
    document.getElementById("Y1").innerHTML = String(parsedArray[9])
    document.getElementById("Y2").innerHTML = String(parsedArray[10])
    document.getElementById("Y3").innerHTML = String(parsedArray[11])

    document.getElementById("D0").innerHTML = String(parsedArray[12])
    document.getElementById("D1").innerHTML = String(parsedArray[13])
    document.getElementById("D2").innerHTML = String(parsedArray[14])
    document.getElementById("D3").innerHTML = String(parsedArray[15])

    document.getElementById("L10").innerHTML = String(parsedArray[16])
    document.getElementById("L11").innerHTML = String(parsedArray[17])
    document.getElementById("L12").innerHTML = String(parsedArray[18])
    document.getElementById("L13").innerHTML = String(parsedArray[19])

    document.getElementById("L20").innerHTML = String(parsedArray[20])
    document.getElementById("L21").innerHTML = String(parsedArray[21])
    document.getElementById("L22").innerHTML = String(parsedArray[22])
    document.getElementById("L23").innerHTML = String(parsedArray[23])

    document.getElementById("M0").innerHTML = String(parsedArray[24])
    document.getElementById("M1").innerHTML = String(parsedArray[25])
    document.getElementById("M2").innerHTML = String(parsedArray[26])
    document.getElementById("M3").innerHTML = String(parsedArray[27])

    document.getElementById("tanf1").innerHTML = "tanf1 = " + String(parsedArray[28])
    document.getElementById("tanf2").innerHTML = "tanf2 = " + String(parsedArray[29])

    let input = String(parsedArray[3])
    let T0h;
    let regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}) (\w+)$/;
    let match = input.match(regex);
    if (match) {
        let [_, year, month, day, hour, minute, second, tz] = match;
        T0h = parseInt(hour)
    }

    document.getElementById("interpath").href = "./SEViewer/index.html?iter=0.5&" + "dT=" + String(parseInt(parsedArray[2])) + "&T0=" + String(T0h) + "&X0=" + String(parsedArray[4]) + "&X1=" + String(parsedArray[5]) + "&X2=" + String(parsedArray[6]) + "&X3=" + String(parsedArray[7]) + "&Y0=" + String(parsedArray[8]) + "&Y1=" + String(parsedArray[9]) + "&Y2=" + String(parsedArray[10]) + "&Y3=" + String(parsedArray[11]) + "&D0=" + String(parsedArray[12]) + "&D1=" + String(parsedArray[13]) + "&D2=" + String(parsedArray[14]) + "&D3=" + String(parsedArray[15]) + "&L10=" + String(parsedArray[16]) + "&L11=" + String(parsedArray[17]) + "&L12=" + String(parsedArray[18]) + "&L13=" + String(parsedArray[19]) + "&L20=" + String(parsedArray[20]) + "&L21=" + String(parsedArray[21]) + "&L22=" + String(parsedArray[22]) + "&L23=" + String(parsedArray[23]) + "&M0=" + String(parsedArray[24]) + "&M1=" + String(parsedArray[25]) + "&M2=" + String(parsedArray[26]) + "&M3=" + String(parsedArray[27]) + "&tanf1=" + String(parsedArray[28]) + "&tanf2=" + String(parsedArray[29]);
    document.getElementById("pathlink").href = "./SEPath/index.html?iter=0.5&" + "dT=" + String(parseInt(parsedArray[2])) + "&T0=" + String(T0h) + "&X0=" + String(parsedArray[4]) + "&X1=" + String(parsedArray[5]) + "&X2=" + String(parsedArray[6]) + "&X3=" + String(parsedArray[7]) + "&Y0=" + String(parsedArray[8]) + "&Y1=" + String(parsedArray[9]) + "&Y2=" + String(parsedArray[10]) + "&Y3=" + String(parsedArray[11]) + "&D0=" + String(parsedArray[12]) + "&D1=" + String(parsedArray[13]) + "&D2=" + String(parsedArray[14]) + "&D3=" + String(parsedArray[15]) + "&L10=" + String(parsedArray[16]) + "&L11=" + String(parsedArray[17]) + "&L12=" + String(parsedArray[18]) + "&L13=" + String(parsedArray[19]) + "&L20=" + String(parsedArray[20]) + "&L21=" + String(parsedArray[21]) + "&L22=" + String(parsedArray[22]) + "&L23=" + String(parsedArray[23]) + "&M0=" + String(parsedArray[24]) + "&M1=" + String(parsedArray[25]) + "&M2=" + String(parsedArray[26]) + "&M3=" + String(parsedArray[27]) + "&tanf1=" + String(parsedArray[28]) + "&tanf2=" + String(parsedArray[29]);

}

main()