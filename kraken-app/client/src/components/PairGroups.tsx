import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { PairGroup, TradingPair } from "../types";

interface PairGroupsProps {
  groups: PairGroup[];
  onSelect: (pair: TradingPair) => void;
  activePairAltname?: string;
}

function PairGroups({ groups, onSelect, activePairAltname }: PairGroupsProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "20px auto" }}>
      {groups.map((group) => (
        <Accordion key={group.quote}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${group.quote}-content`}
            id={`${group.quote}-header`}
          >
            <Typography>
              {group.quote} ({group.pairs.length} pairs)
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {group.pairs.map((pair) => (
              <Button
                key={pair.key}
                variant={
                  pair.altname === activePairAltname ? "contained" : "outlined"
                }
                size="small"
                onClick={() => onSelect(pair)}
              >
                {pair.base}
              </Button>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default PairGroups;
