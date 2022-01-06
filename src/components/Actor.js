import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, Image, Button } from 'react-native';
import { connect } from 'react-redux';

import DisplayError from '../components/DisplayError';

import { getActorDetails } from '../api/theMovieDB';

import Colors from '../definitions/Colors';
import Assets from '../definitions/Assets';

const Actor = ({ route, favActors, dispatch }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [actor, setActor] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    requestActor();
  }, []); // Uniquement à l'initialisation

  // Pourrait être directement déclarée dans useEffect
  const requestActor = async () => {
    try {
      const theMovieDB = await getActorDetails(route.params.actorsID);
      console.log(theMovieDB);
      setActor(theMovieDB);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
    }
  }

  // On pourrait définir les actions dans un fichier à part
  const saveActor = async () => {
    const action = { type: 'SAVE_ACTOR', value: route.params.actorID };
    dispatch(action);
  }

  const unsaveActor = async () => {
    const action = { type: 'UNSAVE_ACTOR', value: route.params.actorID };
    dispatch(action);
  }

  const displaySaveActor = () => {
    if (favActors.findIndex(i => i === route.params.actorID) !== -1) {
      // L'acteur est sauvegardé
      return (
        <Button
          title='Retirer des favoris'
          color={Colors.mainGreen}
          onPress={unsaveActor}
        />
      );
    }
    // L'acteur n'est pas sauvegardé
    return (
      <Button
        title='Ajouter aux favoris'
        color={Colors.mainGreen}
        onPress={saveActor}
      />
    );
  }

  return (
    <View style={styles.container}>
      {isError ?
        (<DisplayError message="Impossible de récupérer les données de l'acteur" />) :
        (isLoading ?
          (<View style={styles.containerLoading}>
            <ActivityIndicator size="large" />
          </View>) :

          (<ScrollView style={styles.containerScroll}>
            <View style={styles.containerCardTop}>
              <View style={styles.containerEstab}>
                <Text style={styles.textName}>
                  {actor.name}
                </Text>
                <Text style={styles.textContent}>
                  {actor.birthday}
                </Text>
                <Text style={styles.textContent}>
                  {actor.death}
                </Text>
                <Text style={styles.textContent}>
                  {actor.biography}
                </Text>
              </View>
              {displaySaveActor()}
            </View>
          </ScrollView>)
        )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    favActors: state.favActorsID
  }
}

export default connect(mapStateToProps)(Actor);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerScroll: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  containerCardTop: {
    elevation: 1,
    borderRadius: 3,
    padding: 12,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  containerCardBottom: {
    elevation: 1,
    marginTop: 16,
    borderRadius: 3,
    padding: 12,
    backgroundColor: 'white',
  },
  containerNoActorImage: {
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: 'white',
  },
  actorImage: {
    height: 180,
    backgroundColor: Colors.mainGreen,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  containerEstab: {
    flex: 4,
  },
  containerNoteAndVotes: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerNote: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textNote: {
    color: 'white',
    fontWeight: "bold",
    fontSize: 16,
  },
  textMaxNote: {
    fontSize: 12,
    marginLeft: 3,
    color: 'white',
  },
  textVotes: {
    fontStyle: "italic",
    fontSize: 12,
  },
  textName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textTitle: {
    fontWeight: 'bold',
    color: Colors.mainGreen,
    fontSize: 16,
    marginTop: 16,
  },
  textContent: {
    fontSize: 16,
  },
});