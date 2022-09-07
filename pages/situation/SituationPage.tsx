import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button, TextField } from '@mui/material'
import { useSituations, useUrlParameters } from 'hooks'
import { useRouter } from 'next/router'
import { TSituation } from 'shared/types'

import { Die } from 'components'

import { StyledSituationPage } from './SituationPage.styled'

type Form = {
  name: string
  expression: string
}

export const SituationPage: React.FC = () => {
  const { replace, back } = useRouter()
  const { space: spaceName, id: situationId } = useUrlParameters()

  useEffect(() => {
    if (!situationId) replace(`/space${spaceName ? '?space=' + spaceName : ''}`)
  }, [situationId])

  const { situation, updateById } = useSituations({ spaceName, situationId })
  const { register, reset, handleSubmit } = useForm<Form>()

  useEffect(() => {
    reset({
      name: situation?.name,
      expression: situation?.expression,
    })
  }, [situation])

  const onSubmit = (data: Form) => {
    updateById({ ...(situation as TSituation), ...data })
    back()
  }

  return (
    <StyledSituationPage onSubmit={handleSubmit(onSubmit)}>
      <section>
        <Die isRolling rollForever />
        <TextField
          label="Nome"
          InputLabelProps={{ shrink: true }}
          {...register('name')}
        />
        <TextField
          label="Expressão"
          InputLabelProps={{ shrink: true }}
          {...register('expression')}
        />
      </section>

      <section className="form-buttons">
        <Button size="large" variant="outlined" onClick={back}>
          Cancelar
        </Button>
        <Button size="large" variant="contained" type="submit">
          Salvar
        </Button>
      </section>
    </StyledSituationPage>
  )
}
