const mongoose = require('mongoose');
const User = mongoose.model('User');
const Projects = mongoose.model('Projects');
const { errorsList } = require('../errors/errorsList');

const ownerCheck = async (req, res, next) => {
      try {
            const { id } = res.locals.authUser;
            const { projectId } = req.body;

            User.findOne({ uid: id }, function (err, user) {
                  if (err) {
                        return res.status(500).send({
                              error: err.message,
                        });
                  } else {
                        if (user === null)
                              return res
                                    .status(404)
                                    .send(errorsList(404, 'User not found.'));

                        Projects.findOne({ users: user._id, projectId })
                              .populate('users', '_id email created_date')
                              .exec(function (err, project) {
                                    // Projects.findOne({ uid: id, pId: projectId }, function (err, project) {
                                    if (err) {
                                          return res
                                                .status(500)
                                                .send(
                                                      errorsList(
                                                            500,
                                                            err.message
                                                      )
                                                );
                                    } else {
                                          if (project === null)
                                                return res
                                                      .status(404)
                                                      .send(
                                                            errorsList(
                                                                  404,
                                                                  'Project not found.'
                                                            )
                                                      );

                                          if (
                                                project.creator.equals(user._id)
                                          ) {
                                                next();
                                          } else {
                                                res.status(401).send(
                                                      errorsList('401')
                                                );
                                          }
                                    }
                              });
                  }
            });
      } catch (error) {
            res.status(400).send(errorsList('400', error.message));
      }
};

module.exports = ownerCheck;
