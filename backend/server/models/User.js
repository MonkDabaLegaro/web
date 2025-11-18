import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  userType: {
    type: String,
    required: true,
    enum: ['admin', 'cliente']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  nombre: {
    type: String,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return candidatePassword === this.password;
};

export default mongoose.model('User', userSchema);

