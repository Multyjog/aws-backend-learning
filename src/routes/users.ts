import * as express from "express";
import { Router, Request, Response } from "express";
// import { getTokenData, verifyToken } from "../middleware/auth";
import { userModel } from "../models/User";
import * as roles from "../middleware/roles";

const router: Router = express.Router();

// exports.grantAccess = function (action, resource) {
//   return async (req, res, next) => {
//     try {
//       const permission = roles.can(req.user.role)[action](resource);
//       if (!permission.granted) {
//         return res.status(401).json({
//           error: "You don't have enough permission to perform this action",
//         });
//       }
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// DELETE
router.delete("/:id", async (req: Request, res: Response) => {
  const resp = await userModel.findById(req.params.id).exec();
  if (!resp) {
    res.status(404).json({ message: "No user found" });
    return;
  }
  await userModel.findByIdAndRemove({
    _id: req.params.id,
  });
  res.status(204).send();
});

export default router;
