import React from 'react'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import { FormControlLabel } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { MainContainer } from './components/MainContainer'
import { Form } from './components/Form'
import { Input } from './components/Input'
import { PrimaryButton } from './components/PrimaryButton'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import parsePhoneNumberFromString from 'libphonenumber-js'
import { useData } from './DataContext'


const schema = yup.object().shape({
    email: yup.string().email('Email should have correct format').required('Email is a required field')
})

const normalizeFormNumber = value => {
    const phoneNumber = parsePhoneNumberFromString(value)
    if (!phoneNumber) {
        return value
    }
    return phoneNumber.formatInternational()
}

export const Step2 = () => {
    const history = useHistory()
    const { data, setValues } = useData()

    const { register, handleSubmit, errors, watch } = useForm({
        defaultValues: { email: data.email, hasPhone: data.hasPhone, phoneNumber: data.phoneNumber },
        mode: 'onBlur',
        resolver: yupResolver(schema)

    })

    const hasPhone = watch('hasPhone')

    const onSubmit = data => {
        history.push('/step3')
        setValues(data)
    }

    return (
        <MainContainer>
            <Typography component='h2' variant='h5'>
                Step 2
            </Typography>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    ref={register}
                    id='email'
                    type='email'
                    label='Email'
                    name='email'
                    required
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                />
                <FormControlLabel
                    label='Do you have a phone'
                    control={
                        <Checkbox
                            name='hasPhone'
                            inputRef={register}
                            color='primary'
                            defaultValue={data.hasPhone}
                            defaultChecked={data.hasPhone}
                        />
                    }
                />

                {
                    hasPhone && (
                        <Input
                            ref={register}
                            id='phoneNumber'
                            type='tel'
                            label='Phone number'
                            name='phoneNumber'
                            onChange={event => {
                                event.target.value = normalizeFormNumber(event.target.value)
                            }}
                        />
                    )
                }

                <PrimaryButton>
                    Next
                </PrimaryButton>
            </Form>
        </MainContainer>
    )

}