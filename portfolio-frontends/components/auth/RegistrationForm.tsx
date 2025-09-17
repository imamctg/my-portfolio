'use client'

import React, { useState } from 'react'
import StudentForm from './StudentForm'
import InstructorForm from './InstructorForm'
import AffiliateForm from './AffiliateForm'

type Props = {
  defaultRole: 'student' | 'instructor' | 'affiliate'
}

const RegistrationForm = ({ defaultRole }: Props) => {
  if (defaultRole === 'student') return <StudentForm />
  if (defaultRole === 'instructor') return <InstructorForm />
  if (defaultRole === 'affiliate') return <AffiliateForm />
  return <StudentForm />
}

export default RegistrationForm
