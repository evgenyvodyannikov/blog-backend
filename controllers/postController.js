import postModel from "../models/post.js";

export const create = async (req, res) => {
  try {
    const doc = new postModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await postModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const post_id = req.params.id;
    postModel.findOneAndUpdate(
      {
        id: post_id,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось получить статью",
          });
        }
        if (!doc) {
          console.log(err);
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json(doc)
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const post_id = req.params.id

    postModel.findByIdAndDelete({
      _id: post_id,
    }, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Не удалось удалить статью',
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }
      
      res.json({
        success: true,
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};

