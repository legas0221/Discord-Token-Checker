const fs = require('fs');
const axios = require("axios");
const readline = require('readline');
let valids = 0;
let invalids = 0;
let nitrads = 0;
let verify = 0;
let nfa= 0;
let tel = 0;

const rl = readline.createInterface({
  input: process.stdin, 
  output: process.stdout
});
const blue = '\x1b[38;5;39m';
const green = '\x1b[32m';
const red = '\x1b[31m'; 
const purple = '\x1b[35m';
const reset = '\x1b[0m'; 


fs.writeFileSync('output/invalid.txt', '');
fs.writeFileSync('output/verified.txt', '');
fs.writeFileSync('output/unverified.txt', '');
fs.writeFileSync('output/nitradas.txt', '');
fs.writeFileSync('output/valid.txt', '');


const tokens = fs.readFileSync('tokens.txt', 'utf-8').replace(/\r/gi, '').split("\n");

function main() {
    csl();
  rl.question(`${purple}Escolha uma opção para prosseguir:${reset}\n1 - Checkar\n0 - Sair\n${purple}Opção:${reset} `, async(opcao) => {
    switch (opcao) {
      case '0':
        console.log('Saindo do Token Checker...');
        rl.close();
        break;
      case '1':{
        for(const token of tokens) {
            if(token !== "") {
                await tokenchecker(`${token}`);
            }
        }
        console.log(`${blue}[FINALIZADO] ${purple}| ${green} VÁLIDOS${reset}: ${valids} - ${red}INVÁLIDOS${reset}: ${invalids} - ${purple}NITRO${reset}: ${nitrads} - ${blue}VERIFICADAS${reset}: ${verify} - ${red}2FA${reset}: ${nfa} - ${blue}TEL${reset}: ${tel}`);
        voltar();
      }
        break;
      case '2':
        console.log("\nEste Checker foi Desenvolvido pelo @whitex0568\n- Servidor que foi Vazado: https://discord.gg/posse\n- Todos os Direitos Reservados.");
        voltar();
        break;
      default:
        main();
    }
  });
}

main();
const bar = `${purple}|${reset}`;

function voltar() {
  rl.question('Pressione ENTER para voltar ao menu...', () => {
    main();
valids = 0;
invalids = 0;
nitrads = 0;
verify = 0;
nfa= 0;
tel = 0;

fs.writeFileSync('output/invalid.txt', '');
fs.writeFileSync('output/verified.txt', '');
fs.writeFileSync('output/unverified.txt', '');
fs.writeFileSync('output/nitradas.txt', '');
fs.writeFileSync('output/valid.txt', '');
  });
}
async function tokenchecker(token) {
    try {
        const response = await axios.get(`https://discordapp.com/api/v7/users/@me`, {
            headers: {
                "authorization": `${token}`
            }
        });
        const {data} = response;
        const fa = data.authenticator_types.length;
        const numb = data.phone ?? "None";
        let nit = "Nenhum";
        if(data.premium_type === 2 ) {
          nit = "Nitro Gaming";
          nitrads++;
          fs.appendFile('output/nitradas.txt', token + "\n", (err) => {
              if (err) throw err;
          });
        } else if (data.premium_type !== 2 && data.premium_type > 0) {
          nit = "Nitro Basic";
          nitrads++;
          fs.appendFile('output/nitradas.txt', token + "\n", (err) => {
              if (err) throw err;
          });
        }
        if(fa > 0) {
            nfa++
        }
        if(numb !== "None") {
            tel++;
        }
        if(data.verified) {
            fs.appendFile('output/verified.txt', token + "\n", (err) => {
                if (err) throw err;
            });
            verify++;
        } else {
            fs.appendFile('output/unverified.txt', token + "\n", (err) => {
                if (err) throw err;
            });
        }
        valids++
        fs.appendFile('output/valid.txt', token + "\n", (err) => {
            if (err) throw err;
        });

        console.log(`${green}[VÁLIDO] ${purple}|${reset} ${token.slice(0,10)}**** ${purple}| ${blue}2FA:${reset} ${fa} ${bar} ${blue} Número:${reset} ${numb} ${bar} ${blue} Verificada:${reset} ${data.verified} ${bar} ${blue}Nitro:${reset} ${nit} ${bar} ${blue}Nome:${reset} ${data.username} ${bar} ${blue}E-Mail:${reset} ${data.email}`);
    } catch(err) {
        invalids++;
        console.log(`${red}[ INVÁLIDO ]${reset} ${purple}|${reset} ${token.slice(0,52)}****`);
        fs.appendFile('output/invalid.txt', token + "\n", (err) => {
            if (err) throw err;
        });
    }
} 

function csl() {
    
console.clear();
const text = `
${purple}                            ██╗     ███████╗ ██████╗  █████╗ ███████╗
${purple}                            ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝
${purple}                            ██║     █████╗  ██║  ███╗███████║███████╗
${purple}                            ██║     ██╔══╝  ██║   ██║██╔══██║╚════██║
${purple}                            ███████╗███████╗╚██████╔╝██║  ██║███████║
${purple}                            ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝`;
console.log(text);
console.log("\x1b[37m                                  >  Discord Token Checker <                        ");
console.log("\x1b[37m                               > https://discord.gg/n6bTXkPxP3 <                        \n\n");
}