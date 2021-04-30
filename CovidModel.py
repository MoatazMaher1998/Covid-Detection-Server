import tensorflow as tf
import cv2
import numpy as np
import pickle
import sys
base_model =tf.keras.applications.InceptionV3(
                include_top=False,
                weights=None,
                input_tensor=None,
                input_shape=(224,224,3),
                pooling='avg',
                classes=1000,
                classifier_activation="softmax",
               )

    

x=base_model.output
x = tf.keras.layers.Dense(7, activation='softmax')(x)
model_test = tf.keras.models.Model(inputs = base_model.input, outputs = x)

infile = open("weights",'rb')
weights_update = pickle.load(infile)
infile.close()

model_test.set_weights(weights=weights_update)

img = cv2.imread(sys.argv[1])/255 
img_modify_size = cv2.resize(img,(224,224))
img_modify_shape = img_modify_size.reshape(1,224,224,3)
result = model_test(img_modify_shape)
a ,b ,c ,d , e ,f , h  = result[0][0].numpy(),result[0][1].numpy(),result[0][2].numpy(),result[0][3].numpy(),result[0][4].numpy(),result[0][5].numpy(),result[0][6].numpy()
max = max(a,b,c,d,e,f,h)
print("Result---->" , max*100,"%")
