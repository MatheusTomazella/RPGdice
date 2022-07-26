import React, { useCallback, useState } from 'react'

import { faDiceD20 } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AddCircle, MoreVert } from '@mui/icons-material'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Link,
  Menu,
  MenuItem,
} from '@mui/material'
import { useSituations, useUrlParameters } from 'hooks'
import { useRouter } from 'next/router'
import { TSituation } from 'shared/types'

import { Die } from 'components'
import { ButtonTextField } from 'components/ButtonTextField'
import { Situation } from 'components/Situation'

import { Column, StyledSpace } from './Space.styled'

export const Space: React.FC = () => {
  const { push } = useRouter()
  const { space: spaceName } = useUrlParameters()
  const {
    situations,
    updateOrInsert: updateById,
    deleteSituation,
  } = useSituations({
    spaceName,
  })

  const [diceExpression, setDiceExpression] = useState('')
  const [isDieRolling, setIsDieRolling] = useState(false)
  const [expressionText, setExpressionText] = useState('')
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(menuAnchor)

  const addToExpression = (value: string) =>
    setExpressionText(
      prev =>
        `${prev}${
          prev.endsWith('+') || prev.endsWith('-') || prev === '' ? '1' : ''
        }${value}`,
    )

  const save = useCallback(
    (situation: TSituation) => updateById(situation),
    [updateById],
  )

  const roll = useCallback(
    (expression?: string) => {
      if (!expression) expression = expressionText
      setDiceExpression(expression)
      setIsDieRolling(true)
      scrollTo({ top: 0 })
    },
    [expressionText, setDiceExpression, setIsDieRolling],
  )

  const rollNoSituation = useCallback(
    () => roll(expressionText),
    [expressionText, roll],
  )

  const goToEditPage = (id: string) =>
    push(`/situation?id=${id}${spaceName ? `&space=${spaceName}` : ''}`)

  const addNewSituation = () =>
    push(
      `/situation${
        expressionText ? `?initialExpression=${expressionText}` : ''
      }`,
    )

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }
  const closeMenu = () => {
    setMenuAnchor(null)
  }

  return (
    <StyledSpace>
      <Column>
        <div className="space-options">
          <IconButton onClick={openMenu}>
            <MoreVert />
          </IconButton>
        </div>
        <Menu open={isMenuOpen} anchorEl={menuAnchor} onClose={closeMenu}>
          <Link href="/help">
            <MenuItem>Ajuda</MenuItem>
          </Link>
        </Menu>

        <div className="dice-box">
          <Die
            expression={diceExpression}
            isRolling={isDieRolling}
            setIsRolling={setIsDieRolling}
          />
        </div>
      </Column>
      <Column>
        <Card className="expression-builder">
          <CardContent>
            <ButtonTextField
              label="Rodar Dado"
              actionFn={rollNoSituation}
              value={expressionText}
              onChange={setExpressionText}
              icon={<FontAwesomeIcon icon={faDiceD20} />}
            />
          </CardContent>
          <CardActions>
            <Box>
              <IconButton onClick={() => addToExpression('d3')}>
                <Chip label="D3" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d4')}>
                <Chip color="warning" label="D4" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d6')}>
                <Chip color="error" label="D6" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d8')}>
                <Chip color="info" label="D8" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d10')}>
                <Chip color="primary" label="D10" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d12')}>
                <Chip color="secondary" label="D12" />
              </IconButton>
              <IconButton onClick={() => addToExpression('d20')}>
                <Chip color="success" label="D20" />
              </IconButton>
            </Box>
            <div>
              <IconButton aria-label="add" onClick={addNewSituation}>
                <AddCircle />
              </IconButton>
            </div>
          </CardActions>
        </Card>

        {situations.map(situation => (
          <Situation
            key={situation.id}
            situation={situation}
            save={save}
            roll={roll}
            edit={goToEditPage}
            deleteFn={deleteSituation}
          />
        ))}
      </Column>
    </StyledSpace>
  )
}
