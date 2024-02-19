const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

let Analyzer = natural.SentimentAnalyzer;
let stemmer = natural.PorterStemmer;

let analyzer = new Analyzer("English", stemmer, "afinn");

const isCommentValid = (commentData)=>{

    const tokens = tokenizer.tokenize(commentData)

    const sentimentResult = analyzer.getSentiment(tokens)

    if(sentimentResult > -0.7 ){
        return true
    }
    else{
        return false
    }
}

exports.analyzeCommentContent = (req,res,next)=>{

    try{

        const {content} = req.body

        if(isCommentValid(content)){
            req.body.isCommentValid = true
        }
        else{
            req.body.isCommentValid = false
        }
        return next()

    }
    catch(e){
        console.log(e);
    }
}