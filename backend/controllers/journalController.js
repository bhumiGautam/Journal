import analyzeText from "../config/ai.js"
import journaModel from "../models/journalSchema.js"


// api to save journal in db
const createJournal = async (req,res) =>{
    try {
        const {userId , ambience , text}= req.body

        const journal = await journaModel.create({
            userId ,
            ambience ,
            text
        })

       res.status(200).json(journal)
    } catch (error) {
        res.status(500).json({
          error: "Failed to create journal",
          details: error.message,
        })
    }
}


// api to get all journals of user
const getAllJournal = async (req, res) => {
    try {
        const userId = req.params.userId

        const data = await journaModel.find({ userId })
        
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getAllJournal:", error);
        res.status(500).json({
          error: "Failed to fetch journals",
          details: error.message,
        });
    }
};



// api to analyze journal text 
const analyzeJournal =  async (req, res) => {
    try {
      const { userId, journalId, text } = req.body

      if (!journalId && !text) {
        return res.status(400).json({ error: 'Either journalId or text is required' })
      }

      let journal = null

      if (journalId) {
        journal = await journaModel.findById(journalId)
        if (!journal) {
          return res.status(404).json({ error: 'Journal not found' })
        }
      }

      if (!journal && userId && text) {
        journal = await journaModel.findOne({ userId, text })
      }

      const textToAnalyze = text ?? journal?.text
      const result = await analyzeText(textToAnalyze)


      if (journal) {
        journal.emotion = result.emotion
        journal.keywords = result.keywords
        journal.summary = result.summary
        journal.isAnalyzed = true
        await journal.save()
        return res.status(200).json(journal)
      }


      if (userId && text) {
        const created = await journaModel.create({
          userId,
          ambience: "analysis", 
          text,
          emotion: result.emotion,
          keywords: result.keywords,
          summary: result.summary,
          isAnalyzed: true,
        })
        return res.status(200).json(created)
      }


      res.status(200).json(result)
    } catch (err) {
      console.error("Error in analyzeJournal:", err)
      res.status(500).json({
        error: "Failed to analyze journal",
        details: err.message,
      })
    }
}


// api to get insights
const getInsights = async (req,res) =>{
    try {
        const userId = req.params.userId

    const entries = await journaModel.find({ userId })

    let emotionCount = {}
    let ambienceCount = {}

    entries.forEach((e)=>{
        if (e.emotion) {
            emotionCount[e.emotion] = (emotionCount[e.emotion] || 0) + 1
        }

        if (e.ambience) {
            ambienceCount[e.ambience] =(ambienceCount[e.ambience] || 0) + 1;
        }
    })


    const recentKeywords = []
    entries
      .slice() 
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .forEach((entry) => {
        if (!Array.isArray(entry.keywords)) return
        entry.keywords.forEach((kw) => {
          if (!recentKeywords.includes(kw)) {
            recentKeywords.push(kw)
          }
        })
      })


    const recentKeywordsTrimmed = recentKeywords.slice(0, 10)


    const topEmotion = Object.keys(emotionCount).sort((a,b)=>
        emotionCount[b] - emotionCount[a]
    )[0] || null;

    const mostUsedAmbience = Object.keys(ambienceCount).sort((a,b)=>
        ambienceCount[b] - ambienceCount[a]
    )[0] || null;

    res.status(200).json({
        totalEntries : entries.length,
        topEmotion,
        mostUsedAmbience,
        recentKeywords: recentKeywordsTrimmed,
    });
    } catch (error) {
        console.error("Error in getInsights:", error);
        res.status(500).json({
          error: "Failed to get insights",
          details: error.message,
        });
    }
}

export  {getAllJournal , getInsights , createJournal , analyzeJournal}
