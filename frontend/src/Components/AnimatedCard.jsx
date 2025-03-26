import { Card, CardContent, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)`
  position: relative;
  overflow: hidden;
  background: rgba(37, 40, 54, 0.8);
`;

const AnimatedCard = ({ children, ...props }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <StyledCard {...props}>
                {children}
            </StyledCard>
        </motion.div>
    );
};

export default AnimatedCard;