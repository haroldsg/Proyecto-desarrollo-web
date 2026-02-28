import Joi from 'joi'

/**
 * Esquema de validación para registro de usuario
 */
export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'El username solo puede contener letras y números',
    'string.min': 'El username debe tener al menos 3 caracteres',
    'string.max': 'El username no puede exceder 30 caracteres',
    'any.required': 'El username es requerido',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser válido',
    'any.required': 'El email es requerido',
  }),

  password: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es requerida',
  }),
})

/**
 * Esquema de validación para login
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser válido',
    'any.required': 'El email es requerido',
  }),

  password: Joi.string().required().messages({
    'any.required': 'La contraseña es requerida',
  }),
})

/**
 * Middleware para validar datos usando Joi
 * @param {Joi.ObjectSchema} schema - Esquema de Joi a validar
 */
export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retorna todos los errores, no solo el primero
      stripUnknown: true, // Elimina campos no definidos en el schema
    })

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }))

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors,
      })
    }

    // Reemplaza req.body con los valores validados y sanitizados
    req.body = value
    next()
  }
}
