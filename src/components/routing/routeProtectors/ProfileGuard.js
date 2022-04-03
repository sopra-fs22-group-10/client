import {useHistory, useParams} from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Checks if the user is allowed to edit the profile of a user
 * @Guard
 * @param props
 */

export const ProfileGuard = props => {
  const history = useHistory();
  const {pathID} = useParams();

  if (localStorage.getItem("UserID")===pathID){
    return props.children;
  }
  return history.goBack();
};

ProfileGuard.propTypes = {
  children: PropTypes.node
};