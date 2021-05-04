const env = require('dotenv');
const supabase_module = require("@supabase/supabase-js");
const supabaseURL = env.config().parsed.API_URL;
const supabaseKEY = env.config().parsed.API_KEY;
const supabase = supabase_module.createClient(supabaseURL, supabaseKEY);

const print = console.log;
print(supabaseURL, supabaseKEY);

const GET_Games = async (msg) => {
    var { body } = await supabase.from('Games').select('*');
    return { body };
}

const GET_Games_id = async (msg, id) => {
    var { body } = await supabase.from('Games').select('*').eq('id', id);
    return { body };
}

const GET_Teams = async (msg) => {
    var { body } = await supabase.from('Teams').select('*');
    return { body };
}

const GET_Teams_id = async (msg, id) => {
    var { body } = await supabase.from('Teams').select('*').eq('id', id);
    return { body };
}

const GET_Bets = async (msg, id) => {
    var { body } = await supabase.from('Bets').select('*');
    return { body };
}

const GET_Bets_id = async (msg, id) => {
    var { body } = await supabase.from('Bets').select('*').eq('id', id);
    return { body };
}

const POST_Bets = async (msg, phoneid, winnerid, gameid) => {
    // Verifica pelo datetime se o game não começou
    if(GET_Games_id(gameid).datetime > msg.date){
        let { body } = await supabase.from('Bets').insert([{ phoneid, winnerid, gameid }])
    } else {
        let body = {}
        body.text = 'O jogo já começou, não foi possível enviar seu palpite!';
    }
    return { body };
}

const PUT_Bets = async (msg, id, winnerid, gameid) => {
    // Verifica pelo datetime se o game não começou
    // if(GET_Games_id(gameid).datetime > msg.date){
        print(id, winnerid, gameid);
        let { body } = await supabase.from('Bets').update([{'winnerid': winnerid}]).match({id: id});
    // } else {
        // let body = {}
        // body.text = 'O jogo já começou, não foi atualizar seu palpite!';
    // }
    print(body);
    return { body };
}

const POST_Users = async (msg, name, phoneid) => {
    let { body } = await supabase.from('Users').insert([{ id, name, phoneid }])
    return { body };
}

// Onde está o score? Implementação naive: contar sempre
// Implementação boa: atualizar e score ser tabela de Users?
const GET_Score = async (msg, id) => {
    var body = await supabase.from('Users').select('*').eq('id', id);
    return body.score ;
}

const inserir_GAMES = async (vetor) => {
    // Função de backend para popular o banco com dados da API
    for(v in vetor){
        var { body } = await supabase.from('Games').insert([v.id, v.team1id, v.team2id, v.winnerid, v.urlStream, v.datetime]);
    }
}

// Exemplo de resposta com botões para usuário escolher o time
const responder = async (msg, req) => {
    // Fazer request pro GET_Games_id
    // Tratar o output do request pra pegar os 2 times
    msg = {
        'chat_id': req.chat_id,
        'text': 'Diga seu palpite de quem vai vencer:',
        'reply_markup': {
            'keyboard':
                [[{'text': 'Time 1'}], 
                [{'text': 'Time 2'}]], 
                'resize_keyboard': true, 
                'one_time_keyboard': true
        }
    }
    // Enviar request pro POST_Games_id e retornar o response dele
    return msg;
}

// Testes
// GET_Bets('', '+5581912345678', 'phoneid');
// GET_Bets_id('', '1', 'id');
// GET_Games('');
// GET_Games_id('');
// GET_Teams('');
// GET_Teams_id('');
// POST_Bets('', '+5581912345678', 7, 5);
// PUT_Bets('', 3, 4, 5);
// POST_Users('', 'Supa Based', '+5581900000000')
// GET_Score('')
