import 'styles/ui/HalfScreenContainer.scss';
import PropTypes from "prop-types";

const HalfScreenContainer = props => (
  <div {...props} className={`half-screen-container ${props.className ?? ''}`}>
    {props.children}
  </div>
);

HalfScreenContainer.propTypes = {
  children: PropTypes.node,
};

export default HalfScreenContainer;